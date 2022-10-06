import React, {
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import LoginContext from '../context/LoginContext';
import user_info_img_d from './image/user_info_img_d.png'
import user_info_img_sign from './image/user_info_img_sign.png'
import { 
  StyleSheet, 
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
 } from "react-native";
 import Axios from 'axios';
 import { HOSTNAME } from "@env";
 import Signature from 'react-native-canvas-signature';
 

function MyPage({navigation}) {

  const {login_data} = useContext(LoginContext);
  const [user_name, set_user_name] = useState(login_data.name);

  const [user_bmark, set_user_bmark] = useState(0);
  const [user_bmark_lst, set_user_bmark_lst] = useState(0);

  const [user_post, set_user_post] = useState(0);
  const [user_post_lst, set_user_post_lst] = useState(0);

  const [user_save_contracts, set_user_save_contracts] = useState(0);
  const [user_save_contracts_lst, set_user_save_contracts_lst] = useState(0);
  const [user_ing_contracts, set_user_ing_contracts] = useState(0);
  const [user_ing_contracts_lst, set_user_ing_contracts_lst] = useState(0);
  const [user_ed_contracts, set_user_ed_contracts] = useState(0);
  const [user_ed_contracts_lst, set_user_ed_contracts_lst] = useState(0);

  const [modalVisible_sign_view, setSignViewModalVisible] = useState(false);
  const [modalVisible_sign_edit_view, setSignEditViewModalVisible] = useState(false);
  const [sign_img_data, setSignImgData] = useState("");
  const [SignImgBase64, setSignImgBase64] = useState(0);

  const my_bookmark = async () => {
    const { data: result } = await Axios.post(HOSTNAME + '/bookmark', { id: login_data.id})
    set_user_bmark(result.length);
    set_user_bmark_lst(result.data);
  }

  const my_post = async () => {
    const { data: result } = await Axios.post(HOSTNAME + '/my_post', { id: login_data.id})
    set_user_post(result.length);
    set_user_post_lst(result.data);
  }

  const my_contract = async () => {
    const { data: result } = await Axios.post(HOSTNAME + '/my_contract', { id: login_data.id})
    set_user_save_contracts(result.contract_length);
    set_user_save_contracts_lst(result.contract_lst);
    set_user_ing_contracts(result.signing_contract_length);
    set_user_ing_contracts_lst(result.signing_contract_lst);
    set_user_ed_contracts(result.signed_contract_length);
    set_user_ed_contracts_lst(result.signed_contract_lst);
  }

  const my_sign = async () => {
    const { data: result } = await Axios.post(HOSTNAME + '/get_sign_info', { id: login_data.id})
    setSignImgBase64(result);
  }

  const edit_my_sign = async () => {
    const { data: result } = await Axios.post(HOSTNAME + '/set_sign_info', { id: login_data.id, sign: sign_img_data})
    my_sign();
  }

  const set_user_info = () => {
    my_contract()
    my_post();
    my_bookmark();
  }

  const ref = useRef();


  useEffect(() => {
    console.log("마이 페이지 데이터 불러오기");
    set_user_info();
  }, []);
  
  return (
    <View style={styles.mypage_container}>
      {/* <Text>{login_data.name}, {login_data.id}, {login_data.login_state}</Text> */}
      {/* 이렇게 사용할 수 있음! */}

      {/* 상단 유저 간략 정보  */}
      <View style={styles.user_info}> 
        <Image source = {user_info_img_d} style={styles.user_info_img}/>
        <View style={styles.user_info_text}>
          <Text style={styles.use_user_info_text_name}> 
            {user_name}님의 계정
          </Text>
          <Text style={styles.use_user_info_text_info}> 
            현재 체결된 계약 {user_ed_contracts}
          </Text>
        </View>
          <Pressable 
          style={styles.btn_log_out}
          onPress={() => 
            navigation.navigate("Login")
          }
        >
          <Text style={styles.textStyle}>
            Logout
            </Text>
        </Pressable>
      </View>

      {/* 하단 상세 유저 정보 리스트*/}
      <View style={styles.setting_list}>

        {/* 계약서 */}
          <View style={styles.setting_item}>
            <Text style={styles.textStyle_2}>계약서</Text>
            <View style={styles.contracts_bar}>
              <View style={styles.contracts_bar_item}> 
                <Text style={styles.textStyle_3}>미체결</Text>
                <Text style={styles.textStyle_3}>{user_save_contracts}</Text>
              </View>
              <View style={styles.contracts_bar_item}> 
                <Text style={styles.textStyle_3}>진행중</Text>
                <Text style={styles.textStyle_3}>{user_ing_contracts}</Text>
              </View>
              <View style={styles.contracts_bar_item}> 
                <Text style={styles.textStyle_3}>체결</Text>
                <Text style={styles.textStyle_3}>{user_ed_contracts}</Text>
              </View>
            </View>
          </View>

        {/* 게시글 */}
          <View style={styles.setting_item}>
            <Text style={styles.textStyle_2}>게시글</Text>
            <View style={styles.contracts_bar}>
              <View style={styles.contracts_bar_item}> 
                <Text style={styles.textStyle_3}>작성 게시글</Text>
                <Text style={styles.textStyle_3}>{user_post}</Text>
              </View>
              <View style={styles.contracts_bar_item}> 
                <Text style={styles.textStyle_3}>즐겨찾기</Text>
                <Text style={styles.textStyle_3}>{user_bmark}</Text>
              </View>
            </View>
          </View>
          {/* 서명 */}
          <View style={styles.setting_item}>
            <Text style={styles.textStyle_2}>서명 관리</Text>
            <View style={styles.contracts_bar}>
              <View style={styles.contracts_bar_item}> 
                <TouchableOpacity style={[styles.btn_sign, styles.textStyle_3]} onPress={() => {
                  my_sign();
                  setSignViewModalVisible(true)

                  }}>
                  <Text style={styles.textStyle_3} >서명</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.contracts_bar_item}> 
                <TouchableOpacity style={[styles.btn_sign, styles.textStyle_3]} onPress={() => setSignEditViewModalVisible(true)}>
                  <Text style={styles.textStyle_3} >서명 수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

      </View>

      {/* 서명 확인 모달  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible_sign_view}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSignViewModalVisible(!modalVisible_sign_view);
        }}
      >
        <View style={styles.sign_view_container}>
          <Image source = {{url: SignImgBase64}} style={styles.user_sign_img}/>          
          <Pressable
            style={[styles.button_modal]}
            onPress={() => setSignViewModalVisible(!modalVisible_sign_view)}
            >
            <Text style={styles.textStyle_4}>Close</Text>
          </Pressable>
        </View>
      </Modal> 

      {/* 서명 편집 모달  */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible_sign_edit_view}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setSignEditViewModalVisible(!modalVisible_sign_edit_view);
        }}
      >
        <View style={styles.sign_view_container}>   
          <View style={[styles.sign_edit_view_container]}>
            <Signature
              containerStyle = {[styles.sign_canvas_container]}
              ref={ref}
              lineWidth={3}
              lineColor="blue"
              canvasStyle={{ 
                borderWidth: 1, 
                borderColor: 'grey',
                width: "100%",
                height: "100%",
                borderRadius: 10, 
              }}
              onBegin={() => console.log('begin')}
              onEnd={() => console.log('end')}
              onChange={(signature) =>{
                console.log(signature)
                setSignImgData(signature)
              }}
            />
          </View>   
          <View style={[styles.sign_edit_btn_view]}>
            <Pressable
              style={[styles.button_modal]}
              onPress={() => {
                // alert(sign_img_data)
                setSignEditViewModalVisible(!modalVisible_sign_edit_view)
                setSignImgBase64(sign_img_data)
                edit_my_sign()
              }}
              >
              <Text style={styles.textStyle_4}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.button_modal]}
              onPress={() => ref.current?.clearSignature?.()}
              >
              <Text style={styles.textStyle_4}>Clear</Text>
            </Pressable>
            
            <Pressable
              style={[styles.button_modal]}
              onPress={() => setSignEditViewModalVisible(!modalVisible_sign_edit_view)}
              >
              <Text style={styles.textStyle_4}>Close</Text>
            </Pressable>
          </View>

          
        </View>
      </Modal> 

    </View>
  );
}

const styles = StyleSheet.create({

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  textStyle_2: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    textAlign: "left",
    margin: 10,
  },
  textStyle_3: {
    fontSize: 15,
    color: "grey",
    fontWeight: "bold",
    textAlign: "center",
    padding: 7,
    paddingLeft: 30,
    paddingRight: 30,
  },
  textStyle_4: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
  },
  mypage_container:{
    flex: 1,
    alignItems: 'center',
  },
  user_info: {
    backgroundColor: '#D9D9D9',
    marginTop: 10,
    width: "90%",
    height: "20%",
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    flexDirection:'row',
    alignItems: 'center',
  },
  user_info_text: {
    margin: '5%',
    flexDirection:'column',
  },
  use_user_info_text_name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  use_user_info_text_info: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  user_info_img: {
    width: 75,
    height: 75,
    borderRadius: 100, 
    borderColor: "#939393",
    borderWidth: 3,
    marginLeft: 10,
  },
  btn_log_out:{
    position: 'absolute',
    top: 5,
    right: 5,
    width: "20%",
    height: "20%",
    backgroundColor: '#939393',
    borderRadius: 10, 
    alignItems: 'center',
    justifyContent: 'center',
  },

  setting_list:{
    backgroundColor: '#D9D9D9',
    width: "100%",
    height: "85%",
    marginTop: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
    
  },
  contracts_bar:{
    flexDirection:'row',
    margin: 10,
    borderRadius: 10, 
    backgroundColor: 'white',
    height: '60%',
    justifyContent: 'space-between',
  },
  contracts_bar_item:{

  },
  setting_item:{
    padding: 10,
    height: "30%",
  },
  btn_sign:{
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  
  modalView: {
    margin: 20,
    width: "95%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 0
  },

  modal_btn_view: {
    width: "100%",
    flexDirection: 'row', // 혹은 'column'
    justifyContent: 'space-between',
  },
  sign_view_container: {
    width: "100%",
    height: "35%",
    alignItems: "center",
    marginTop: "50%",
    borderColor: "#2196F3",
    borderWidth: 3,
    backgroundColor: "white",
    borderRadius: 10,
  },
  button_modal: {
    width: "28%",
    margin: 10,
    backgroundColor: "#2196F3",
    borderRadius: 10,
  },
  user_sign_img : {
    width: "95%",
    height: "60%",
    borderRadius: 10, 
    borderColor: "#939393",
    borderWidth: 1,
    margin: 10,
    backgroundColor: "white",
  },
  sign_edit_view_container: {
    width: "95%",
    height: "60%",
    margin: 10,
    alignItems: "center",
    borderColor: "#939393",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
  },
  sign_edit_btn_view: {
    width: "100%",
    flexDirection: 'row', // 혹은 'column'
    justifyContent: 'space-between',
  },
  sign_canvas_container: {
    width: "100%",
    height: "100%"
  }
});

export default MyPage;