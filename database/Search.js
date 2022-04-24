import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Picker,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Button, Icon } from "react-native-elements";
import axios from "axios";
import Mycontext, { fdate } from "../context/Mycontext";
import { resultdb } from "./db";

export default function SearchScreen1(props) {
  const mystatus = useContext(Mycontext);
  const [searchText, setSearchText] = useState("");
  const [items, setItems] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filterfield, setFilterfield] = useState("color");

  useEffect(async () => {
    StatusBar.setBarStyle("dark-content", false);
    var userstring;
    userstring = await resultdb("select * from items where type=?", [
      mystatus.Activetype,
    ]);
    setItems(userstring.rows._array);
    setFilteredUsers(items);
  }, []);

  const HandlerAdd = () => {
    props.navigation.navigate("Detail");
  };
  return (
    <View style={{ flex: 1, paddingTop: 5 }}>
      <View style={styles.container}>
        <View flexDirection="row" justifyContent="center">
          <Text style={styles.text}>{mystatus.Activetype} </Text>
          <Button onPress={HandlerAdd} title="байхгүй бол нэмээрэй" />
        </View>
        <View style={styles.searchView}>
          <View
            style={styles.inputView}
            flexDirection="row"
            justifyContent="center"
          >
            <Picker
              style={{ flex: 1 }}
              selectedValue={filterfield}
              onValueChange={(l) => {
                setFilterfield(l.value);
              }}
            >
              {[
                { name: "Нэр", value: "color" },
                { name: "Им", value: "im" },
                { name: "Тамга", value: "tamga" },
                { name: "Т/бар", value: "desc" },
              ].map((l) => (
                <Picker.Item label={l.name} value={l.value} />
              ))}
            </Picker>
            <TextInput
              style={{ flex: 6 }}
              defaultValue={searchText}
              style={styles.input}
              placeholder="Хайя"
              placeholderTextColor="blue"
              textContentType="name"
              onChangeText={(text) => {
                setSearchText(text);
                if (text === "") {
                  return setFilteredUsers(items);
                }
                // const filtered_users = users.filter((user) =>
                //   user.name.first.toLowerCase().startsWith(text.toLowerCase())
                // );
                const filtered_users = items.filter((user) =>
                  user.color.toLowerCase().includes(text.toLowerCase())
                );
                setFilteredUsers(filtered_users);
              }}
              returnKeyType="search"
            />
            {searchText.length === 0 ? (
              <TouchableOpacity>
                <Icon name="search" size={24} color="#333" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setSearchText("");
                  setFilteredUsers(items);
                }}
              >
                <Icon name="cancel" size={24} color="#333" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {filteredUsers.length > 0 ? (
          <ScrollView>
            {filteredUsers.map((user) => (
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => {
                  Alert.alert(
                    `${user.color} ${user.tamga}`,
                    `Онцлог зүс ${user.im}`
                  );
                }}
              >
                <Image
                  style={styles.userImage}
                  source={{
                    uri: "https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png",
                  }}
                />
                <View key={user.id} style={styles.userCardRight}>
                  <Text
                    style={{ fontSize: 18, fontWeight: "500" }}
                  >{`${user.color} ${user.im}`}</Text>
                  <Text>{`${user?.tamga}`}</Text>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 50 }}></View>
          </ScrollView>
        ) : searchText.length > 0 ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageBoxText}>Хайлт олдсонгүй</Text>
          </View>
        ) : (
          <View style={styles.messageBox}>
            <Text style={styles.messageBoxText}>
              Хайх талбар,утгаа оруулна уу
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 5,
  },
  searchView: {
    paddingTop: 10,
    display: "flex",
    flexDirection: "row",
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: "#dfe4ea",
    paddingHorizontal: 10,
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  userCard: {
    backgroundColor: "#fafafa",
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
  messageBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: "500",
  },
  text: {
    fontSize: 18,
    padding: 3,
    marginHorizontal: 5,
    marginVertical: 1,
    justifyContent: "space-between",
    textAlign: "left",
    borderWidth: 1,
    borderColor: "#74D122",
    borderBottomWidth: 5,
  },
});
