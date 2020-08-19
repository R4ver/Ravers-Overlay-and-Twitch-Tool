import React, { useState, useEffect } from "react";
import { useStore } from "Store";
import axios from "axios";

import { Input, Button, UploadButton } from "Components";

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
                
                console.log(result.error);

                setGames(result.data.searchData ? result.data.searchData : []);

            } catch (error) {
                console.log(error);
                setGames([
                    {
                        id: null,
                        name: "No games found",
                    },
                ]);
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
        const { name, value } = e.target;
        if ( value === "" ) {
            setInputValues(prev => ({
                ...prev,
                [name]: state.channel[name]
            }));
            setGames([]);
        }
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
            }

            
        } catch (error) {
            console.log(error);
        }
    }

    const chooseGame = ({game_id, game_name}) => {
        if ( !game_id ) return;

        setInputValues((prev) => ({
            ...prev,
            game_id,
            game_name
        }));
        setGames([]);
    }

    const onFileChange = async (event, isDefault = false) => {
        try {
            const file = event.target.files[0];
    
            // Create an object of formData 
            const formData = new FormData(); 
    
            // Update the formData object 
            formData.append( 
                "gameBackground", 
                file, 
                isDefault ? "default" : state.channel.game_id
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
                        current_game_background_url: data.current_game_background_url,
                        default_background_url: data.default_background_url
                    },
                });
            }

        } catch (e) {
            console.log("Failed to upload wallpaper", e);
        }
    }
    console.log(inputValues, games);

    const gamesList = games.map(game => (
        <li key={game.id} onClick={() => chooseGame({game_id: game.id, game_name: game.name})}>{game.name}</li>
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
                    autoComplete="off"
                />
            </section>

            <section className="section">
                <Input 
                    id="game" 
                    name="game_name"
                    value={inputValues.game_name}
                    minLength={3}
                    debounce={true}
                    debounceTimeout={500}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    label="Game"
                    autoComplete="off"
                />
                {games.length > 0 &&
                    <ul>
                        {gamesList}
                    </ul>
                }
            </section>

            <section className="section game-background">
                <label className="label">Game Wallpaper</label>
                <UploadButton image={state.channel.current_game_background_url} onChange={onFileChange} />
            </section>

            <section className="section game-background">
                <label className="label">Default Wallpaper</label>
                <UploadButton image={state.channel.default_background_url} onChange={(e) => onFileChange(e, true)} />
            </section>

            <section className="section">
                <Button onClick={updateChannel} className="fill is-floating" iconType="fas" icon="save" />
            </section>
        </div>
    );
}

export default Home;