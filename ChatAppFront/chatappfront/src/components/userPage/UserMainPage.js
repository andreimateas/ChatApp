
import {navBarWrapper} from "../navbar/navBarWrapper";
import "./UserMainPage.css";
import Feed from "./feed/Feed";
import React, {useEffect, useState} from "react";
import {FeedPostController} from "../../controller/FeedPostController";
import {useAuthContext} from "../../auth/AuthProvider";
import FeedPost from "../../controller/entities/FeedPost";
import SockJS from 'sockjs-client';
import {over} from 'stompjs';
import MyMap from "./MyMap";
import feed from "./feed/Feed";
import Swal from "sweetalert2";

const UserMainPage=()=> {

    const [message, setMessage] = useState('');


    const socket = new SockJS('http://localhost:3001/ws');
    const stompClient = over(socket);
    let isConnected = false;

    useEffect(() => {
        const connect = () => {
            stompClient.connect({}, () => {

                isConnected = true;
                console.log('WebSocket connected');
                stompClient.subscribe('/topic/updates', (response) => {
                    const data = JSON.parse(response.body);
                    setMessage(data);
                    fetchData();
                });
            });
        };

        const disconnect = () => {
            if (isConnected) {
                stompClient.disconnect(() => {
                    isConnected = false;
                    console.log('WebSocket disconnected');
                });
            }
        };

        connect();

        return disconnect;
    }, []);


    const sendMessage = (message) => {
        if (isConnected) {
            stompClient.send('/app/sendMessage', {}, JSON.stringify(message));
        } else {
            console.log('WebSocket connection is not established');
        }
    };

    const [feedPosts, setFeedPosts]= useState([]);

    const { userProfile } = useAuthContext();

    const fields= userProfile.userString.split(",");
    const user= fields[0];

    const [username, setUsername] =useState('');
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    const [date, setDate] =useState(formatDate(new Date()).replace(' ', 'T'));
    const [contentText, setContentText] =useState('');
    const [contentImage, setContentImage] =useState('');


    async function fetchData() {
        const controller = new FeedPostController();
        const feedPosts = await controller.getFeedPosts();
        feedPosts.forEach((x) => (x.date = x.date.replace(/T/g, ' ')));
        console.log("Received feed posts from server: ", feedPosts);
        setFeedPosts(feedPosts);
        setUsername(user);
    }

    useEffect( () => {
        document.getElementById("postText").value="";
        fetchData();
    }, []);

    async function onAddPostButtonClicked(){
        if(contentText.length<5){
            await Swal.fire({
                title: "Post is too short!",
                icon: "error",
                color: '#A83140FF',
                confirmButtonColor: '#A83140FF',

            });
        }
        else{
        try{
            setDate(formatDate(new Date()).replace(' ', 'T'));
            const controller= new FeedPostController();
            const feedPost= new FeedPost(username+date,username,contentText,contentImage,date,0);
            const token= await controller.addFeedPost(feedPost);
            console.log("Received token from server: "+token.string);
            fetchData();
            setContentText("");

        }catch(exception){
            console.log("error add post");
        }
        }
    }

    const updateLikes = async (post,liked) => {
        try {
            const controller= new FeedPostController();
            const feedPost= post;
            const date= new Date(feedPost.date);
            feedPost.date=formatDate(date).replace(' ', 'T');
            if(liked===true){
                feedPost.likes++;
            }
            else{
                feedPost.likes--;
            }
            const token= await controller.addFeedPost(feedPost);
            console.log("Received token from server: "+token.string);
            fetchData();

        } catch (exception) {
            console.log("error like post"+exception);
        }
    }


    return (
        <div className={"mainDiv1"}>
            <div className={"feed1"}>

            <h1 className={"feedHeader1"}>YOUR FEED</h1>
                <h2 id={"cityHeader"}>Everywhere</h2>

                <div id="map" style={{ width: '95%', height: '500px', alignContent: 'center'}}><MyMap/></div>

                <div className={"add-post-div"}>
                    <textarea id={"postText"} value={contentText}
                               onChange={(e) => setContentText(e.target.value)} className={"add-post-textarea"}
                        placeholder="Write your post..."
                    ></textarea>
                    <label className={"file-input-label"}>
                        Image
                        <input  value={contentImage}
                                onChange={(e) => setContentImage(e.target.value)} type="file" className={"add-post-file-input"}  />
                    </label>
                    <button type="submit" className={"add-post-button"}  onClick={onAddPostButtonClicked}>Post</button>

                </div>

                <Feed posts={feedPosts} onLikeButtonClick={updateLikes}/>

            </div>
        </div>
    );
}

const UserMainPageWrapped = navBarWrapper(UserMainPage);
export default UserMainPageWrapped;