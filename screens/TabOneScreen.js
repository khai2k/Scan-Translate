import * as React from "react";
import {
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Audio } from "expo-av";
import { Text, View } from "../components/Themed";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { useEffect } from "react";
import WordLine from "../components/WordLine";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { color } from "react-native-reanimated";
const windowWidth = Dimensions.get("window").width;

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("wordHistory", jsonValue);
  } catch (e) {
    // saving error
  }
};

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("wordHistory");
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};
// const wordHistory = [
//   {
//     word: 'Bottle',
//     translate: 'Chai',
//     star: true
//   },
//   {
//     word: 'hello',
//     translate: 'xin chao',
//     star: false
//   }
// ]
const translateApi = "https://api.mymemory.translated.net/get";
export default function TabOneScreen(props) {
  const [ENtoVN, setENtoVN] = useState(true);
  const [translate, setTranslate] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [input, setInput] = useState("");
  const [uri, setUri] = useState("");
  const [output, setOutput] = useState("");
  const [wordHistory, setWordHistory] = useState([]);
  const [sound, setSound] = React.useState();
  useEffect(() => {
    if (props.route.params) {
      setENtoVN(true);
      setInput(props.route.params.textScaned);
    }
  }, [props.route]);
  async function playSound({ isEn, isInput }) {
    try {
      const language = isEn ? "en" : "vi-VN";

      const word = isInput ? input : output;
      let test = word.replace(/(\r\n|\n|\r)/gm, "");
      let url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${test.trim()}&tl=${language}&total=1&idx=0&textlen=7&client=tw-ob&prev=input&ttsspeed=1`;
      let url_encode = encodeURI(url);
      const { sound } = await Audio.Sound.createAsync(
        {
          // uri: `https://translate.google.com/translate_tts?ie=UTF-8&q=thanks&tl=en&total=1&idx=0&textlen=7&client=tw-ob&prev=input&ttsspeed=1`,
          uri: url_encode,
        },
        true
      );

      setSound(sound);
      await sound.playAsync();
    } catch (error) {}
  }
  React.useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  useEffect(() => {
    const fetchData = async (input, ENtoVN) => {
      const langpair = ENtoVN ? "en|vie" : "vie|en";
      // https://api.mymemory.translated.net/get?q=Hello%20World!&langpair=en|it
      if (input === "") return;

      try {
        let url = `${translateApi}?q=${input}&langpair=${langpair}`;
        let url_encode = encodeURI(url);
        console.log(url_encode);

        let { data } = await axios.get(url_encode);
        console.log(
          "🚀 ~ file: TabOneScreen.js ~ line 108 ~ fetchData ~ data",
          data.responseData.translatedText
        );

        let translateWord = data.responseData.translatedText;
        setOutput(translateWord);
        storeData([
          { word: input, translateWord: translateWord, star: false },
          ...wordHistory,
        ]);
      } catch (error) {
        console.log(error, "===========================");
        setOutput("cảm ơn vì đã lắng nghe");
      }
    };

    if (translate) fetchData(input, ENtoVN);
  }, [translate, reRender]);
  useEffect(() => {
    const getWordHistory = async () => {
      const data = await getData();
      if (data == null) return;
      setWordHistory(data);
    };
    getWordHistory();
  }, [output]);
  return (
    <View style={styles.container}>
      {renderInput()}
      {translate && renderOutput()}
      {renderHistory()}
    </View>
  );
  function renderHistory() {
    return (
      <ScrollView style={{ flex: 1 }}>
        {wordHistory.map((data, index) => {
          return (
            <WordLine
              key={index}
              data={data}
              onChangeStar={(star) =>
                storeData([
                  {
                    word: data.word,
                    translateWord: data.translateWord,
                    star: star,
                  },
                  ...wordHistory,
                ])
              }
            />
          );
        })}
      </ScrollView>
    );
  }
  function renderOutput() {
    return (
      <View style={{ padding: 10, backgroundColor: "#1a73e8", minHeight: 100 }}>
        <Text style={{ color: "white" }}>{output}</Text>
        <TouchableOpacity
          style={{ position: "absolute", bottom: 10, left: 10 }}
          onPress={() => playSound({ isEn: !ENtoVN, isInput: false })}
        >
          <Feather name="volume-2" size={24} color="white" />
        </TouchableOpacity>
      </View>
    );
  }

  function renderInput() {
    return (
      <View
        style={{
          height: 200,
          width: windowWidth,
          borderBottomWidth: 1,
          borderColor: "#e8e8e8",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: "#1a73e8" }}>
              {ENtoVN ? "English" : "Vietnamese"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setENtoVN(!ENtoVN)}>
            <AntDesign name="retweet" size={24} color="black" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ color: "#1a73e8" }}>
              {ENtoVN ? "Vietnamese" : "English"}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <TextInput
              onSubmitEditing={() => {
                setTranslate(true);
                setReRender(!reRender);
                Keyboard.dismiss();
              }}
              value={input}
              onChangeText={(text) => {
                setInput(text);
              }}
              placeholder="Enter text"
              style={{ height: 200 }}
              multiline
            />
          </View>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => {
              setTranslate(false);
              setInput("");
            }}
          >
            <Text>X</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity
            style={{
              alignItems: "center",
              display: input == "" ? "none" : "flex",
            }}
            onPress={() => playSound({ isEn: ENtoVN, isInput: true })}
          >
            <Feather name="volume-2" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            borderTopWidth: 1,
            borderColor: "#e8e8e8",
          }}
        >
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => props.navigation.navigate("Camera")}
          >
            <AntDesign name="camera" size={24} color="#1a73e8" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => props.navigation.navigate("Gallery")}
          >
            <Feather name="image" size={24} color="#1a73e8" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
