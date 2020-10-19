# Boop

<br>

## Description

This is an app to look for dogsitters.

<br>

## User stories

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

- **Signup:** As an anon I can sign up in the platform as dog owner or dogsitter so that I can see the preview of a limited amount of users.

- **Login:** As a user I can login to the platform so that I can see other users' profiles and get in touch.

- **Logout:** As a user I can logout from the platform so no one else can use it

-**Dashboard** As a user, I have access to my profile details and favourites so I can review them.

- **Favourites:** As a user, I have access to my favourite list so I can edit it.

- **ProfilesBoard** As a user, I can see a list of all the users registered to the platform so I can filter them according to my requirements.

- **ProfileDetails** As a user, I can see all the details of a specific user so I can get in touch.

- **About** As anon user/user, I can read what the platform is about.

<br>

## Backlog

- **Calendar:** as dog owner type of user I can save in the system the dates I need a dogsitter so other users can see.
- **Email notifications** as user receive notifications on signup and being able to get in touch with users throug the platform without sharing my email address.
- **GeoLocation**: as users I would like to add my address and see on a map other's user location (postcode only).
- **Ads**: as dog owner I can create personalised ad to the public board so everyone can see them.

<br>

# Client / Frontend

## React Router Routes (React App)

| Path                    | Component                     | Permissions                | Behavior                                                                                                           |
| ----------------------- | ----------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/`                     | Home                          | public `<AnonRoute>`       | Preview limited number of profiles. Link to signup page when click on users cards.                                 |
| `/about`                | About                         | public `<AnonRoute>`       | About page.                                                                                                        |
| `/auth/signup`          | SignUp                        | anon only `<AnonRoute>`    | Signup form, link to login, new user form, navigate to homepage after signup.                                      |
| `/auth/login`           | LogIn                         | anon only `<AnonRoute>`    | Login form, link to signup, navigate to homepage after login.                                                      |
| `/auth/logout`          | n/a                           | user only `<PrivateRoute>` | Navigate to Home screen after logout, expire session.                                                              |
| `/home`                 | Board                         | user only `<PrivateRoute>` | Shows users profiles and filters otions. Links to single users' profiles.                                          |
| `/profile`              | Dashboard, Settings, Search   | user only `<PrivateRoute>` | Show user's details, links to Home, Settings (links to edit profile, password, delete profile) and Search (Board). |
| `/profile/edit`         | EditProfile, Settings, Search | user only `<PrivateRoute>` | Edit user's details links to Home, Settings (links to edit password, delete profile) and Search (Board).           |
| `/profile/delete`       | Delete Profile                | user only `<PrivateRoute>` | Delete profile.                                                                                                    |
| `/profile/editPassword` | EditPassword                  | user only `<PrivateRoute>` | Edit password.                                                                                                     |
| `/public-profile`       | PublicProfile                 | user only `<PrivateRoute>` | Public profile details page.                                                                                       |
| `get`                   | `**`                          | NotFoundPageComponent      | public                                                                                                             |

## Components

- Auth: SignUp, Login, Logout
- Home (anon)
  - Input: profiles (show limited amount)
  - Output: none
- About (anon)
  - Input: none
  - Output: none
- Board
  - Input: all profiles
  - Output: profile(userId)
- User:
  -Dasboard
  - Input: profile(userId)
  - Output: none
    -EditProfile
  - Input: profile(userId)
  - Output: profile(userRole, username, password, email, image, aboutMe) borough, Features(populate
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
- PublicProfile

<br>

## Services

auth.login(user)
auth.signup(user)
auth.logout()
getAllUsers()
getUser(userId)
editUser(userId)
editPassword(userId)
getBorough()
getBreed()
uploadImage()

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
  	String, enum: ['Doggo', 'Doggositter'],
  	required: [true, 'Type of user is required. Pick one from the list']
  }
  username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
  },
  image: {
      type: String,
      required: [true, 'Image is required.']
    },
    aboutMe: {
      type: String,
      required: [true, 'A brief description is required.']
    },
    borough: {
      type: String,
      required: [true, 'Please pick a Borough']
    },
    Features: {[{ type: Schema.Types.ObjectId, ref: "Features" }]}
},
  {
    timestamps: true}



Features {
size: {type: String, enum: ['small', 'medium', 'large'],
      required: [
        true,
        "Size is required, pick one of the listed items",
      ],
    },
 energy: {type: String, enum: ['tornado', 'chilled', 'couch potato'],
      required: [
        true,
        "Energy level is required, pick one of the listed items",
      ],
    },
 behaves: {type: String, enum: ['soldier', 'I kinda get it', 'huh?'],
      required: [
        true,
        "Behavior is required, pick one of the listed items",
      ],
    },
 pottyTraining: {type: String, enum: ['expert', 'okay', 'ouch!'],
      required: [
        true,
        "Potty Training state is required, pick one of the listed items",
      ],
    },
 chill: {type: String, enum: ['indoor', 'outdoor'],
      required: [
        true,
        "Energy is required, pick one of the listed items",
      ],
    },
 breed: {type: String,
      required: [
        true,
        "Energy is required, pick one of the listed items",
      ],
    },
}
```

<br>

## Endpoints (backend routes)

| HTTP Method | URL                     | Request Body                                                                       | Success Status       | Error Status | Description                                                                                                           |
| ----------- | ----------------------- | ---------------------------------------------------------------------------------- | -------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| POST        | `/auth/signup`          | {userRole, username, password, email, image, aboutMe, borough, Features(populate)} | 201 with user object | 404          | validation: fields not empty (422), user not exists (409), create user with encrypted password, store user in session |  |
| POST        | `/auth/login`           | {username, password}                                                               | 200 with user object | 404          | validation: fields not empty (422), user exists (404), passdword matches (404), store user in session                 |
| POST        | `/auth/logout`          | (empty)                                                                            | 204                  | 400          |
| PUT         | `/profile/editProfile/` | {userRole, username, password, email, image, aboutMe, borough, Features(populate)} | 200                  | 400          | Edits user details                                                                                                    |
| GET         | `/profile`              | {userRole, username, password, email, image, aboutMe, borough, Features(populate)} | 200                  | 404          | Lists profile details                                                                                                 |
| POST        | `/edit-password`        | {password}                                                                         | 200                  | 404          | Edit password                                                                                                         |
| GET         | `/home`                 |                                                                                    | 200                  | 404          | Lists all users                                                                                                       |
| DELETE      | `/profile/delete`       |                                                                                    | 200                  | 400          | Deletes profile                                                                                                       |

<br>

## Links

### Trello

[Go to Trello Board]()

### Github

[Server Repository](https://github.com/NubivagantYansa/Boop_server)

[Client Repository]()

[Deployed App Link](

### Slides

[GSlides]()
