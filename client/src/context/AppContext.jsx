import { useContext, useState } from "react";
import { createContext } from "react";

import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL=import.meta.env.VITE_BASE_URL

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const [isAdmin ,setIsAdmin] = useState(false)
    const [shows,setShows] = useState([])

    const [favoritesMovies,setFavoritesMovies] = useState([])

    const{user}=useUser()

    const{getToken}=useAuth()
    const location =useLocation()
    const navigate=useNavigate()

    const fetchIsAdmin = async () => {
        try {
            const {data} = await axios.get('/api/admin/is-admin',{headers:{Authorization:`Bearer ${await getToken()}`}})
            setIsAdmin(data.isAdmin)

            if(!data.isAdmin && location.pathname.startsWith('/admin')){
               navigate('/')
               toast.error('You are not authorized to access admin dashboard')
            }

        } catch (error) {
            console.error(error);
        }
    };

    const fetchShows = async () => {
        try {
           const {data} = await axios.get('/api/show/all')
           if(data.success){
            setShows(data.shows)
           }else{
            toast.error(data.message)
           }
        } catch (error) {
            console.error(error);
        }
    };

const fetchFavoritesMovies = async () => {
    try {
       const {data} = await axios.get('/api/user/favorites',{headers:{Authorization:`Bearer ${await getToken()}`}})
       if(data.success){
        setFavoritesMovies(data.favoritesMovies)
       }else{
        toast.error(data.message)
       }
    } catch (error) {
        console.error(error);
    }
};

useEffect(() => {
    if(user){
        fetchFavoritesMovies();
    }
    
}, [user]);

    
    useEffect(() => {
      fetchShows();

}, []);
    
    


    useEffect(() => {
        if(user){
            fetchIsAdmin();
            fetchFavoritesMovies();
        }
        
    }, [user]);

  



    const value ={
        axios,
        fetchIsAdmin,
        user,
        getToken,
        navigate,
        isAdmin,
        shows,
        favoritesMovies,
        fetchFavoritesMovies
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext);
}

