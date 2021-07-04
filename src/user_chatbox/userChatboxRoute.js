var userChatbox = require("./userChatbox");

const ChatboxRoutes = [
  {
    path: "/userChatbox/allusers",
    method: "post",
    callback: userChatbox.AllUsers,
    guard:false,
  },
  {
    path: "/userChatbox/createMessage",
    method: "post",
    callback: userChatbox.CreateMessage,
    guard:false,
  },
  {
    path: "/userChatbox/getMessages",
    method: "post",
    callback: userChatbox.GetMessages,
    guard:false,
  },
  {
    path: "/userChatbox/deleteMessage",
    method: "post",
    callback: userChatbox.DeleteMessage,
    guard:false,
  },
  {
    path: "/userChatbox/deleteReceipt",
    method: "post",
    callback: userChatbox.DeleteReceipt,
    guard:false,
  },
  {
    path: "/userChatbox/userChats",
    method: "post",
    callback: userChatbox.UserChats,
    guard:false,
  },
  
];

module.exports = ChatboxRoutes;
