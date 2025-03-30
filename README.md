# Video Manager

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Development Server

Install node modules (my node version is 22.10.0):
```sh
npm i
```

Run the development server using:
```sh
ng serve
```
or
```sh
npm run start
```

## Features

1️⃣ **Video Storage in Firebase**
- **Firebase Storage** is used to upload and store video files.
- A special file is stored for **connection speed testing**.

2️⃣ **Automatic Video Quality Selection**
- The application determines **optimal video quality** based on network speed.
- Users can manually select the video quality.
- Future improvement: Detect the user's camera settings (`track.getSettings()`) to hide unavailable quality options (e.g., if the camera supports only 720p).

3️⃣ **Responsive Interface**
- The UI adapts when the screen width is **<1500px** for better usability.

4️⃣ **State Management with NGXS**
- **NGXS** is used for managing the video state.
- Actions are implemented for **uploading and deleting videos**.

5️⃣ **Correct Video Duration Detection**
- The [`@fix-webm-duration/fix`](https://www.npmjs.com/package/@fix-webm-duration/fix) library is used.
- It appends **metadata to the Blob**, ensuring accurate video duration calculation.

## Screenshots

### 1. Checking connection, starting application
![Main Screen](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F1.jpg?alt=media&token=6e516316-e322-4608-ab1a-78415d8aa2b0)

### 2. Access to camera has been obtained, video quality selection
![Video Playback](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F2.jpg?alt=media&token=ca7ee3cf-d6f7-454c-834a-54e6326245ae)  

### 3. Video recording
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F3.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)  

### 4. Recorded videos have appeared
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F4.jpg?alt=media&token=204d5048-bf5e-407e-a37d-7e946fb20178)

### 5. Hovering at the recorded video
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F5.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)  

### 6. Video Delete Modal Window
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F6.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)

### 7. Modal window with video playback
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F7.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)

### 8. Modal window with video playback if the cursor has not been moved for more than 2 seconds
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F8.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)  

### 9. Interface if width is less than 1500px
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F9.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)

### 10. Error if access to camera was not obtained (any other error should also appear here)
![Upload Interface](https://firebasestorage.googleapis.com/v0/b/video-manager-66b18.firebasestorage.app/o/screenshots%2F10.jpg?alt=media&token=ef19d20e-12fb-4a34-956d-d718f3033ee0)
