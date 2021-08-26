import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { URL_SCAN } from "../env";

export default function ImagePickerExample(props) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  const fetchAPI = async (base64) => {
    try {
      setLoading(true);
      let body = { name: "fetch_image", src: base64 };
      const { data } = await axios.post(URL_SCAN, body);
      props.navigation.navigate("TabOneScreen", { textScaned: data.text });
    } catch (error) {
      props.navigation.navigate("TabOneScreen", {
        textScaned: "Sorry, can not scan",
      });
    }
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      fetchAPI(result.base64);
    }
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Button title="Pick an image from camera roll" onPress={pickImage} />
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
      )}
    </>
  );
}
