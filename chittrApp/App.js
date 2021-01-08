import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from './screens/HomeScreen';
import SignUp from './screens/SignUp';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import LoadingScreen from './screens/LoadingScreen';
import Tweet from './screens/Tweet';
import addTweet from './screens/addTweet';
import SearchUsers from './screens/SearchUsers';
import ViewProfile from './screens/ViewProfile';
import MyProfile from './screens/MyProfile';
import Followers from './screens/Followers';
import Following from './screens/Following';
import viewDrafts from './screens/viewDrafts';
import UnauthorisedChits from './screens/UnauthorisedChits';
import UserFollowing from './screens/UserFollowing';
import UserFollowers from './screens/UserFollowers';


const login = createStackNavigator({
        Home: {
            screen: HomeScreen
        },
        SignUp: {
            screen: SignUp
        },
        Login: {
            screen: LoginScreen
        },
        UnauthorisedChits: {
            screen: UnauthorisedChits
        }
    },
    {
        headerMode: "none",
        initialRouteName: "Home"
    });


const loggedIn = createStackNavigator({
        Home: {
            screen: HomeScreen
        },
        Tweet: {
            screen: Tweet
        },
        addTweet: {
            screen: addTweet
        },
        SearchUsers: {
            screen: SearchUsers
        },
        ViewProfile: {
            screen: ViewProfile
        },
        MyProfile: {
            screen: MyProfile
        },
        Following: {
            screen: Following
        },
        Followers: {
            screen: Followers
        },
        ViewDrafts: {
            screen: viewDrafts
        },
        UserFollowing: {
            screen: UserFollowing
        },
        UserFollowers: {
            screen: UserFollowers
        },

    },
    {
        headerMode: "none",
        initialRouteName: "Tweet"
    });

const AppStackNav = createStackNavigator({
        Auth: login,
        App: loggedIn,
        AuthLoadingScreen: LoadingScreen
    },
    {
        headerMode: "none",
        initialRouteName: "AuthLoadingScreen"
    });



const AppContainer = createAppContainer(AppStackNav)
export default AppContainer;
