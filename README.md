# NoseBook

NoseBook is a Facebook clone that I have made as a final project for my full stack web development course. It has the core functionalities that Facebook has, which includes uploading posts, commenting on posts, liking a post/comment, sending/accepting friend requests, real time messaging, and real time notification system for posts, messages, friend requests etc.

[View Live](https://nosebook-social.netlify.app)

[API repository](https://github.com/ShirshoDipto/social-media-api)

[Socket repository](https://github.com/ShirshoDipto/nosebook-socket)

## Technologies used

1. MongoDb (with Mongoose)
2. Express js
3. React js
4. Node js
5. Passport js
6. JWT
7. Socket.io
8. Cloudinary
9. Multer
10. Bcrypt js
11. Express Validator
12. HTML React Parser
13. Material Icon

and more

## Running Locally

To run the api and socket server locally, follow the instructions on the [API Repository](https://github.com/ShirshoDipto/social-media-api) and [Socket repository](https://github.com/ShirshoDipto/nosebook-socket) respectively.

### Clone Repository

```
git clone git@github.com:ShirshoDipto/social-media-client.git
```

```
cd social-media-client
```

### Set up environment variables

```
REACT_APP_SERVERROOT = <Address of the api server. https://nosebook-api.fly.dev or local address, e.g http://localhost:5000>

REACT_APP_SOCKETROOT = <Address of the socket server. https://nosebook-socket.onrender.com or local address, e.g http://localhost:4000>

REACT_APP_CLIENTROOT = <Address of the client. http://localhost:3000 by default>

GOOGLE_CLIENT_ID = <>
```

### Install packages and start

```
npm install
```

```
npm run build
```

```
npm install -g serve
```

```
serve -s build
```

## Features & Highlights

(For more info, checkout the Additional Info section below)

### 1. Authentication

- Basic Login and Signup with username and password.
- Login/Signup with a google account.
- Login and Signup form validation from the backend.
- Logout

### 2. Users

- Update/remove profile picture
- Update/remove cover picture.
- Update user biodata.
- Error handling in profile update
- Search users (See additional info no.1)

### 3. Friendships

- Send, accept, and reject friend requests from other users. (See additional info no.2)
- Remove users from the friend list.
- Show friendship status upon entering a user’s profile.

### 4. Posts

- Timeline posts on homepage
- Users posts on specific profile page
- Infinite scrolling on both homepage and profile page
- Error handling in uploading new post
- Create posts
- Update own posts
- Delete own posts
- Include images with posts
- Include emojis with posts by right clicking on post input.
- Include line breaks in posts. (See additional info no.3)

### 5. Comments

- Comment on posts
- Update own comments
- Delete own comments
- Infinite scrolling
- Include emojis with comments by right clicking on comment input.
- Include line breaks in comments.

### 6. Likes

- Like/unlike posts.
- Like/unlike comments.

### 7. Notifications (See additional info section no.3)

- Notifications for new posts
- Notifications for new messages
- Notifications for new friend requests
- Notification when a friend request is accepted
- Pagination for notifications.

### 8. Messenger

- Create a chat conversation with a user. _Similar to opening a new chat conversation with another user on Skype_. (See additional info no.4)
- Sorting of chat conversations based on the date of the most recent message.
- Unseen messages indicator on chat conversations.
- Send and receive messages real time.

### 9. Socket

- Real time messaging.
- Continuous typing indicator. **It is better than that of Skype and Telegram** (See additional info no.5)
- Real time notification for new post. (See additional info no.6)
- Real time notification for new friend request
- Real time notification when a friend request is accepted
- Real time notification for new unseen messages. **It is the most complex feature of this app, and it depends on the user’s location within the app. It doesn't make sense to send a real time notification if the user who is receiving the message is already on the messenger page.** (See additional info no.7)
- Online and offline friends on homepage. Sorted based on a friend's activity status. (See additional info no.8)
- Online and offline users on messenger page

## Additional Informations

#### 1. Searching users:

The search functionality is implemented by using mongoDB full text search index. A user can search for other users by their first name, last name, or email address. Regular expression is used at the backend to process email search queries.

    A gif.

#### 2. Friend requests:

A user can send another user friend request by going to his/her profile page. The friendship status on the user’s profile page is shown based on whether there is a pending friend request between the two users. If a user receives a friend request from another user, that friend request can be viewed from the notification panel as well as from the profile page of the user who sent the request. The request can be accepted or rejected from both places.

    A gif.

#### 3. Notifications:

Notification feature is very much like the YouTube notification system. Notifications never get deleted, except the friend requests. Therefore, a user can see all the old notifications.

    A gif.

#### 4. Creating a chat conversation:

The only way to start a new chat with a user is to go to that user’s profile page and click the message button. If user A goes to user B’s profile page and clicks the message button, it will create a temporary chat conversation on the messenger page of user A but user B cannot yet see the conversation. If user A sends a message to user B, then that temporary chat conversation will be made permanent and user B can see the new chat conversations appear on his/her own messenger page.

A gif.

But if user A decides to leave the messenger page without sending any message to user B, then the temporary chat will be removed from user A’s chat conversation list. User B will not receive anything. See the gif below.

A gif.

#### 5. Continuous typing Indicator:

If user A starts typing for user B, the typing indicator “user A is typing …” appears on user B’s screen, and it will be removed if user A does not type for 2 seconds. It takes Skype 20 seconds to recognize that user A has stopped typing. So if user A gives a single keystroke to the input and does nothing else, user B will see “user A is typing …” text for 20 seconds before the indicator disappears, creating an impression that user A was indeed typing for 20 seconds. For Telegram, it is 6 seconds.

The app does not send an event to the socket server every single time the user gives a keystroke. Rather, it sends only two events during the entire typing session: one is when the user starts typing, and another one is when the user stops typing. Therefore, the feature is not heavy on the backend.

A gif.

#### 6. Real time notification for new post:

When a user uploads a new post, the socket server does not broadcast an event to all the connected users of this app. Instead, it only sends an event to all the friends of that user who are online, keeping the runtime complexity of the operation within O(n) where n is the number of friends of the user.

A gif

#### 7. Real time Notifications for unseen messages:

If user A sends message(s) to user B, the way user B will receive those messages depends on the following scenarios:

- User B is not active.
- User B is active but not on the messenger page.
- User B is on the messenger page, but the active chat is not user A.
- User B is on the messenger page and the active chat is also user A. Meaning, user B is chatting with user A.

If user B is not active, then the socket server simply creates a notification for user B which can be viewed after coming online.

A gif.

If user B is active but not on the messenger page, then the socket server creates a notification which user B will be getting real time.

A gif

If user B is on the messenger page, but he/she is not chatting with user A, meaning the active chat is not user A, then the socket server sends those messages as unseen messages. User B’s chat conversation list will show user A’s chat conversation at the top and how many messages are unseen.

A gif.

If user B is chatting with user A, or if user B’s active chat is user A, then it will become a simple real time messaging where the typing indicator will also be shown.

A gif.

The feat is achieved by utilizing React components’ lifecycle method.

#### 8. Online and offline friends on the homepage:

The order in which the friend list of a user is shown on the homepage is based on the activity status of the friends. The online friends are always shown at the beginning, and then the offline friends. If a friend goes offline, then that friend is removed from the online friend list and put at the beginning of the offline friend list, indicating that this friend just went offline. If a friend comes online, then that friend is removed from the offline friend list and put at the beginning of the online friend list, indicating that this friend just came online. This complexity does not come with any inefficiency. The runtime complexity at the front end is still O(n) where n is the number of friends of that user.

A gif

Similar to the post notification feature, the socket server does not broadcast an event to all the connected users of this app when a user comes online. Instead, it only sends an event to all the friends of that user who are online, keeping the runtime complexity of the operation within O(n) where n is the number of friends of the user.
