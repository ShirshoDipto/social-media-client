const serverRoot = process.env.REACT_APP_SERVERROOT;

export async function getUnseenMsgs(convId, token) {
  try {
    const res = await fetch(
      `${serverRoot}/api/messenger/conversations/${convId}/messages/unseen`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.messages;
  } catch (error) {
    console.log(error);
  }
}

export async function getOldMsgs(convId, skipMsgs, token) {
  try {
    const res = await fetch(
      `${serverRoot}/api/messenger/conversations/${convId}/messages/seen?skip=${skipMsgs}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.messages;
  } catch (error) {
    console.log(error);
  }
}

export async function markUnseenAsSeen(conv, token) {
  try {
    const res = await fetch(
      `${serverRoot}/api/messenger/conversations/${conv._id}/messages`,

      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seenBy: [conv.members[0]._id, conv.members[1]._id],
        }),
      }
    );

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.messages;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSingleConv(msg, token) {
  try {
    const res = await fetch(
      `${serverRoot}/api/messenger/conversations/${msg.conversationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.conversation;
  } catch (error) {
    console.log(error);
  }
}

export async function createNewConv(userId, token) {
  try {
    const res = await fetch(`${serverRoot}/api/messenger/conversations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.conversation;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchConversations(token) {
  try {
    const res = await fetch(`${serverRoot}/api/messenger/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = await res.json();
    if (!res.ok) {
      throw resData;
    }

    return resData.conversations;
  } catch (error) {
    console.log(error);
  }
}
