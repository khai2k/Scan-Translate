import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import WordLine from "../components/WordLine";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

export default function TabTwoScreen() {
  const [wordHistory, setWordHistory] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(500).then(() => setRefreshing(false));
  }, []);
  const getWordHistory = async () => {
    const data = await getData();
    if (data == null) return;
    setWordHistory([...data]);
  };
  useEffect(() => {
    getWordHistory();
  }, [refreshing]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "white" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {wordHistory.map((data, index) => {
        if (data.star === true)
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
