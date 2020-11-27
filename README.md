# Boop

<br>

## Description

This is a platform where dog owners can look for dogsitters and vice versa.

<br>

## User stories

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

-**Home** As an anon user, I have access to the landpage.

- **Signup:** As an anon I can sign up in the platform as dog owner or dogsitter so that I can see the preview of a limited amount of users.

- **Login:** As a user I can login to the platform so that I can see other users' profiles and get in touch.

- **Logout:** As a user I can logout from the platform so no one else can use it

-**Dashboard** As a user, I have access to my profile details.

- **Board** As a user, I can see a list of all the users registered to the platform so I can filter them according to my requirements.

- **ProfileDetails** As a user, I can see all the details of a specific user so I can get in touch.

- **EditProfile** As a user, I can edit my profile details.

- **EditPassword** As a user, I can edit my password.

- **DeleteProfile** As a user, I can delete my profile.

<br>

## Backlog

- **Email notifications** as user receive notifications on signup and being able to get in touch with users throug the platform without sharing my email address.
- **GeoLocation**: as users I would like to add my address and see on a map other's user location (postcode only).
- **Ads**: as dog owner I can create personalised ad to the public board so everyone can see them.
- **Calendar:** as dog owner type of user I can save in the system the dates I need a dogsitter so other users can see.

<br>

# Client / Frontend

## React Router Routes (React App)

| Path              | Component                     | Permissions                | Behavior                                                                                                           |
| ----------------- | ----------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/`               | Home                          | public `<AnonRoute>`       | Preview limited number of profiles. Link to signup page when click on users cards.                                 |
| `/signup`         | SignUp                        | anon only `<AnonRoute>`    | Signup form, link to login, new user form, navigate to homepage after signup.                                      |
| `/login`          | LogIn                         | anon only `<AnonRoute>`    | Login form, link to signup, navigate to homepage after login.                                                      |
| `/auth/logout`    | n/a                           | user only `<PrivateRoute>` | Navigate to Home screen after logout, expire session.                                                              |
| `/board`          | Board                         | user only `<PrivateRoute>` | Shows users profiles and filters otions. Links to single users' profiles.                                          |
| `/dashboard`      | Dashboard, Settings, Search   | user only `<PrivateRoute>` | Show user's details, links to Home, Settings (links to edit profile, password, delete profile) and Search (Board). |
| `/edit-profile`   | EditProfile, Settings, Search | user only `<PrivateRoute>` | Edit user's details links to Home, Settings (links to edit password, delete profile) and Search (Board).           |
| `/delete-profile` | Delete Profile                | user only `<PrivateRoute>` | Delete profile.                                                                                                    |
| `/edit-password`  | EditPassword                  | user only `<PrivateRoute>` | Edit password.                                                                                                     |
| `/profile/:id`    | Profile details               | user only `<PrivateRoute>` | Profile details specific user page.                                                                                |
| `get`             | `**`                          | NotFoundPageComponent      | public                                                                                                             |

## Components

- Auth: SignUp, Login, Logout
- Home (anon)
  - Input: all profiles
  - Output: none
- Board
  - Input: all profiles
  - Output: profile(userId)
- User:
  - Dasboard
  - Input: profile(userId)
  - Output: none
    -EditProfile
  - Input: profile(userId)
  - Output: profile(userRole, username, password, email, image, aboutMe, address), Features(populate
    -EditPassword
  - Input: profile(userId)
  - Output: none
    -Settings
  - Input: profile(userId)
  - Output: none
    -Search
  - Input: all profiles
  - Output: filtered results
    -DeleteProfile

<br>

## Services

- Users Service
  login(user)
  signup(user)
  validateSession()
  userLogout()
  uploadImage(image)()
  editProfile()
  editPassword()

  - Community Service
    getAllProfiles()
    getProfileDetails()
    sendEmail()

  - Breeds Service
    getAllBreeds()

<br>

# Server / Backend

## Models

```javascript

Session {
  userId: { type: ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
    index: { expires: 60*60*24 }
  },
}

User {
  _id:
  userRole: {
      type: String,
      enum: ["Dog owner", "Dogsitter"],
      required: isProd ? [true, "Type of user is required."] : false,
    },
    username: {
      type: String,
      trim: true,
      required: isProd ? [true, "Username is required."] : false,
      unique: true,
    },
    email: {
      type: String,
      required: isProd ? [true, "Email is required."] : false,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: isProd ? [true, "Password is required."] : false,
    },
    image: {
      type: String,
      required: isProd ? [true, "Image is required."] : false,
    },
    aboutMe: {
      type: String,
      required: isProd ? [true, "A brief description is required."] : false,
    },
    address: {
      type: String,
      required: [true, "Please add an address."],
    },
    //from mapbox
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
    },
    features: { type: ObjectId, ref: "Features" },
  },
  {
    timestamps: true,
  }
);



Features {
 author: { type: ObjectId, ref: "User" },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large"],
      required:
        isProd === "production"
          ? [true, "Size is required, pick one of the listed items"]
          : false,
    },
    energy: {
      type: String,
      enum: ["Tornado", "Chilled", "Couch potato"],
      required:
        isProd === "production"
          ? [true, "Energy level is required, pick one of the listed items"]
          : false,
    },
    behaves: {
      type: String,
      enum: ["Soldier", "I kinda get it", "huh?"],
      required:
        isProd === "production"
          ? [true, "Behavior is required, pick one of the listed items"]
          : false,
    },
    pottyTraining: {
      type: String,
      enum: ["Expert", "Okay", "Ouch!"],
      required:
        isProd === "production"
          ? [
              true,
              "Potty Training state is required, pick one of the listed items",
            ]
          : false,
    },
    chill: {
      type: String,
      enum: ["Indoor", "Outdoor"],
      required:
        isProd === "production"
          ? [true, "Chill preference is required, pick one of the listed items"]
          : false,
    },
    breed: {
      type: String,
      required:
        isProd === "production"
          ? [true, "Breed is required, pick one of the listed items"]
          : false,
    },
  },
  {
    timestamps: true,
  }
```

<br>

## Endpoints (backend routes)

| HTTP Method | URL                        | Request Body                                                                                     | Success Status       | Error Status | Description                                                                                                           |
| ----------- | -------------------------- | ------------------------------------------------------------------------------------------------ | -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| POST        | `/auth/signup`             | {userRole, username, password, email, image, aboutMe, address, Features(populate)}               | 201 with user object | 404          | validation: fields not empty (422), user not exists (409), create user with encrypted password, store user in session |
| POST        | `/auth/login`              | {username, password}                                                                             | 200 with user object | 404          | validation: fields not empty (422), user exists (404), passdword matches (404), store user in session                 |
| POST        | `/auth/logout`             | (empty)                                                                                          | 204                  | 400          | Logout                                                                                                                |
| POST        | `/user-edit`               | { accessToken, userRole, username, password, email, image, aboutMe, address, Features(populate)} | 200                  | 400          | Edit user details                                                                                                     |
| POST        | `/image`                   | {image }                                                                                         | 200                  | 400          | Upload Image to cloudinary                                                                                            |
| POST        | `/delete-profile/:userId/` | { userId }                                                                                       | 200                  | 400          | Delete user profile                                                                                                   |
| POST        | `/edit-password`           | {password}                                                                                       | 200                  | 404          | Edit password                                                                                                         |
| GET         | `/session/:accessToken`    | {accessToken}                                                                                    | 200                  | 404          | Validate session token Router                                                                                         |
| DELETE      | `/profile/delete`          | {userId}                                                                                         | 200                  | 400          | Delete profile                                                                                                        |
| GET         | `/get-profiles`            | (empty)                                                                                          | 200                  | 404          | List all profiles                                                                                                     |
| GET         | `/get-profile/:id`         | (empty)                                                                                          | 200                  | 404          | List deatils specific profile                                                                                         |
| POST        | `/send-email/:receiver`    | {bodyEmail, sender, receiver}                                                                    | 200                  | 404          | Send email                                                                                                            |

<br>

## Links

### Trello

[Go to Trello Board](https://trello.com/b/0WXX4m1Z/project-3-boop)

### Github

[Server Repository](https://github.com/NubivagantYansa/Boop_server)

[Client Repository](https://github.com/NubivagantYansa/Boop_Client)

[Deployed App Link](https://b00p.netlify.app)

### Slides

[GSlides](https://docs.google.com/presentation/d/1mD7uLPrAgLAkNkcuhHp4bKQWbQiq3eOBAom6jTvvFr8/edit?usp=sharing)
