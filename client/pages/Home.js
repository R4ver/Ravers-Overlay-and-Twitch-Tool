import React, { useState, useEffect } from "react";
import { useStore } from "Store";
import axios from "axios";

import { Input } from "Components";

const Home = () => {
    const [state, setState] = useStore();
    const [inputValues, setInputValues] = useState({
        title: state.channel.title,
        game_name: state.channel.game_name,
        game_id: state.channel.game_id
    })
    const [fileToUpload, setFileToUpload] = useState(null);
    const [games, setGames] = useState([]);
    const [skipSearch, setSkipSearch] = useState(true);

    useEffect( () => {

        if ( inputValues.game_name === "" ) {
            setSkipSearch(true);
            setGames([]);
            return;
        }

        if ( skipSearch ) {
            setSkipSearch(false);
            return;
        }

        ( async () => {
            try {
                const result = await axios.get(`/api/search`, {
                    params: {
                        query: inputValues.game_name
                    },
                });
                
                if ( result.status === 200 ) {
                    setGames(result.data.searchData ? result.data.searchData : []);
                }

            } catch (error) {
                console.log(error);
            }
        })()

    }, [inputValues.game_name])
    
    const handleInputChange = e => {
        const key = e.target.name;
        const value = e.target.value;

        setInputValues(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const handleBlur = e => {
        const name = e.target.name;
        setInputValues(prev => ({
            ...prev,
            [name]: state.channel[name]
        }));
        setGames([]);
        setSkipSearch(true);
    }

    const updateChannel = async () => {
        try {
            const { title, game_id } = inputValues;
            const {data: { channel }, status: channelStatus} = await axios.patch(`/api/channel`, {
                title,
                game_id
            });
    
            if ( channelStatus === 200 ) {
                setState({
                    channel
                })
                setGames([])
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    const chooseGame = ({game_id, game}) => {
        setInputValues((prev) => ({
            ...prev,
            game_id,
            game_name
        }));
    }

    const onFileChange = async (event) => {
        try {
            const file = event.target.files[0];
    
            // Create an object of formData 
            const formData = new FormData(); 
    
            // Update the formData object 
            formData.append( 
                "gameBackground", 
                file, 
                state.channel.game_id
            ); 
    
            // Request made to the backend api 
            // Send formData object 
            const {data} = await axios.post("/api/game/uploadBackground", formData); 
    
            if ( data.status === 200 ) {
                console.log("Uploaded new wallpaper", data);
                setFileToUpload(Date.now());
                setState({
                    channel: {
                        ...state.channel,
                        current_game_background_url: data.imagePath
                    },
                });
            }

        } catch (e) {
            console.log("Failed to upload wallpaper", e);
        }
    }
    console.log(inputValues, games);

    const gamesList = games.map(game => (
        <li key={game.id} onClick={() => chooseGame({game_id: game.id, game: game.name})}>{game.name}</li>
    ))

    return (
        <div className="page-content dashboard">
            <section className="section">
                <Input 
                type="text" 
                id="title" 
                name="title" 
                value={inputValues.title} 
                onChange={handleInputChange} 
                label="Stream Title" 
            />
            </section>

            <section className="section">
                <Input 
                    id="game" 
                    name="game_name"
                    value={inputValues.game_name}
                    minLength={5}
                    debounce={true}
                    debounceTimeout={500}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    label="Game"
                />
                {games.length > 0 &&
                    <ul>
                        {gamesList}
                    </ul>
                }
            </section>
            <section className="section">
                <button onClick={updateChannel}>Update Information</button>
            </section>

            <section className="section game-background">
                <input type="file" accept="image/png" onChange={onFileChange} />
                {state.channel.current_game_background_url &&
                    <img src={state.channel.current_game_background_url} />
                }
            </section>
        </div>
    );
}

export default Home;