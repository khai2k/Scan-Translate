import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { URL_SCAN } from "../env";

export default function App(props) {
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [imgBase64, setImgBase64] = useState("");
  const cameraEL = useRef(null);
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const fetchAPI = async (base64) => {
    try {
      let body = { name: "fetch_image", src: base64 };
      const { data } = await axios.post(URL_SCAN, body);
      props.navigation.navigate("TabOneScreen", { textScaned: data.text });
    } catch (error) {
      props.navigation.navigate("TabOneScreen", {
        textScaned: "Sorry, can not scan",
      });
    }
  };
  const snap = async () => {
    if (cameraEL) {
      const options = { quality: 1, base64: true };
      const photo = await cameraEL.current.takePictureAsync(options);
      setLoading(true);
      fetchAPI(photo.base64);
    }
  };
  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <View style={styles.container}>
          <Camera ref={cameraEL} style={styles.camera} type={type}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <Text style={styles.text}> Flip </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ position: "absolute", bottom: 20, left: 150 }}
                onPress={() => snap()}
              >
                <Ionicons name="md-radio-button-on" size={80} color="white" />
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
