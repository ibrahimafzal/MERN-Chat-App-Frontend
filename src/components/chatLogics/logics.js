export const getSender = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ?
        users[1]?.name :
        users[0]?.name
}

export const getSenderFull = (loggedUser, users) => {
    return users[0]._id === loggedUser?._id ? users[1] : users[0]
}

export const isSameSender = (messages, m, i, userId) => {
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender?._id !== m.sender._id ||
            messages[i + 1].sender?._id === undefined) &&
        messages[i].sender?._id !== userId
    )
}

export const isLastMessage = (messages, i, userId) => {
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender?._id !== userId &&
        messages[messages.length - 1].sender?._id
    )
}

export const capitalizeSentences = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

export const isSameSenderMargin = (messages, m, i, userId) => {
    if (
        i < messages?.length - 1 &&
        messages[i + 1]?.sender?._id === m?.sender?._id &&
        messages[i]?.sender?._id !== userId
    )
        return 36;
    else if (
        i < messages?.length - 1 &&
        messages[i + 1]?.sender?._id !== m?.sender?._id &&
        messages[i]?.sender?._id !== userId ||
        (i === messages?.length - 1 && messages[i]?.sender?._id !== userId)
    ) return 0;
    else return "auto"
}

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender?._id === m?.sender?._id
}

export const getOtherUserImage = (chat, loggedUser ) => {
    const otherUser = chat?.users.find(user => user?._id !== loggedUser?._id)
    return otherUser ? otherUser.pic : ""
}

export const copyToClipboard = (messageId, textToCopy) => {        
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Unable to copy:', err);
      });
  };

  export const formatTime = (utcTimestamp) => {
    const date = new Date(utcTimestamp); // Convert UTC timestamp to a Date object
    const formattedTime = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); // Format time

    return formattedTime;
}