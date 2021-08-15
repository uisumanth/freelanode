var userChatbox = require("./userChatbox");

const ChatboxRoutes = [
  {
    path: "/userChatbox/allusers",
    method: "post",
    callback: userChatbox.AllUsers,
    guard:true,
  },
  {
    path: "/userChatbox/createMessage",
    method: "post",
    callback: userChatbox.CreateMessage,
    guard:true,
  },
  {
    path: "/userChatbox/getMessages",
    method: "post",
    callback: userChatbox.GetMessages,
    guard:true,
  },
  {
    path: "/userChatbox/deleteMessage",
    method: "post",
    callback: userChatbox.DeleteMessage,
    guard:true,
  },
  {
    path: "/userChatbox/deleteReceipt",
    method: "post",
    callback: userChatbox.DeleteReceipt,
    guard:true,
  },
  {
    path: "/userChatbox/userChats",
    method: "post",
    callback: userChatbox.UserChats,
    guard:true,
  },
  
];

module.exports = ChatboxRoutes;
