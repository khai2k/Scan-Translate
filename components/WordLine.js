import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "../components/Themed";

export default function WordLine(props) {
  const { data, onChangeStar } = props;
  const { word, translateWord, star } = data;
  const [favorite, setFavorite] = useState(star);
  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 5,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: "#e8e8e8",
      }}
    >
      <View style={{ flex: 1 }}>
        <Text>{word}</Text>
        <Text>{translateWord}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          onChangeStar(!favorite);
          setFavorite(!favorite);
        }}
      >
        <View style={{ justifyContent: "center" }}>
          {favorite ? (
            <AntDesign name="star" size={24} color="yellow" />
          ) : (
            <AntDesign name="staro" size={24} color="black" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}
