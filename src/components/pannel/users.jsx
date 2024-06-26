// style
import "../../static/pannel-apps/contact.css";
// icons 
import Multiple from "../../static/icons/multiple.svg";
import Search from "../../static/icons/search.svg";
import Plus from "../../static/icons/plus.svg";
// dark mode 
import { useSelector, useDispatch } from "react-redux";
// react router dom 
import { Link, useLocation , useNavigate} from "react-router-dom";
// img 
import Image from "../../images/b-314.jpg";
import { changeApp } from "../../reducers/pannel";
// animation  
import { Slide, Fade } from "react-awesome-reveal";
// close pannel 
import { closePannel } from "../../reducers/background";
// react pop up 
import Popup from "reactjs-popup";
import {  useEffect, useState } from "react";
import AddContactPopUp from "../popup/AddContact";
// API
import API, { setAccessWhen401 } from "../../authentication/auth";
// change contact and page 
import {changePage,changeChatType} from "../../reducers/page";
import  {changeContact ,contactToggle} from "../../reducers/contact";
import { changeMessageToggle } from "../../reducers/message";








const Users = () => {


    const mode = useSelector((state) => state.background.mode);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [contacts, setContacts] = useState([]);
    const [currentUser,setCurrentUser] = useState({});
    const toggleContact = useSelector((state)=> state.contact.toggle);


    const getOrCreateChatWithContact = async (withWho) => {
        await API.post("/chat/",{"with_who" : withWho.id}).then((response) => {
            const contact = response.data.with_who === currentUser ? response.data.create_by : response.data.with_who ;
            dispatch(changeContact({"chat_id" : response.data.id,...contact,...contact.profile}));
            dispatch(contactToggle());
        }).catch((error) => {
            try {
                if (error.response.status === 401) {
                    setAccessWhen401(navigate, location.pathname);
                }
            } catch { } 
        });
        dispatch(changeMessageToggle())
    };


    const getData = async () => {
        await API.get("/user/contacts/").then((response) => {
            setContacts(response.data.contacts.filter((item)=> item.phone !== response.data.phone));
            setCurrentUser(response.data);
        }).catch((error) => {
            try {
                if (error.response.status === 401) {
                    setAccessWhen401(navigate, location.pathname);
                }
            } catch { }
            dispatch(contactToggle());
        });
    };

    const userClick = (user) => {
        dispatch(changeChatType("chat"))
        dispatch(changePage("chat"));
        getOrCreateChatWithContact(user);
        dispatch(changeContact({...user}))
    }


    useEffect(() => {
        getData();
    }, [toggleContact])

    return (
        <Slide direction="left" duration={300}>
            <div className="contact outlet" onClick={() => dispatch(closePannel())}>
                <div className="contact-info">
                    <div className="contact-info-icons">
                        <Link to={"/"} onClick={() => dispatch(changeApp("none"))} >
                            <div><img src={Multiple} className="icon-pannel-link" /></div>
                        </Link>
                        <div>
                            <Popup modal nested trigger={<img src={Plus} className="icon-pannel-link popup-parent" />}>
                                <AddContactPopUp />
                            </Popup>
                        </div>
                        {/* <div>
                            <Popup trigger={<img src={Search} className="icon-pannel-link" />}>
                                22
                            </Popup>
                        </div> */}
                    </div>
                    <div className={"contact-info-text " + mode}>
                        <h3>مخاطبین</h3>
                        <p>اینجا پیام رسانی کنید</p>
                    </div>
                </div>
                <div className="users">
                    {
                        contacts && contacts.map((contact, index) => {
                            return (
                                <div className="user" onClick={()=> userClick(contact) } key={index}>
                                    <div className="user-img">
                                        <img src={Image} />
                                    </div>
                                    <div className="user-text">
                                        <div className="user-text-top">
                                            <h4 className={mode} >
                                                {contact.profile.username ? contact.profile.username : contact.phone}
                                            </h4>
                                            {/* <p>1401/01/01</p> */}
                                        </div>
                                        {/* <div className="user-text-middle">
                                            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است.
                                        </div>
                                        <div className="user-text-bottom seen">
                                            دیده شده
                                        </div> */}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </Slide>
    )
}; export default Users;