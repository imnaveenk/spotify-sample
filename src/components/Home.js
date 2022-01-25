import React, { useState, useEffect } from "react";
import { setToken, getToken, errorHandler, updateQueryStringParameter } from "../helper";
import { useLocation } from "react-router";
import { throttle } from "lodash";
import axios from "axios";

const throttledSearch = throttle(
  (value, searchSpotify) => {
    searchSpotify(value);
  },
  500,
  { leading: false, trailing: true }
);

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Home = () => {
  // store the tokens if available
  let query = useQuery();
  let loginKey = query.get("loginKey");
  let loginToken = query.get("loginToken");
  // Checks if we have loginToken and Window object
  if (loginToken && loginKey && window && localStorage) {
    setToken(loginKey, loginToken);
  }

  const [data, setData] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(1);
  const [loginUrl, setLoginUrl] = useState("");
  const [searchText, setSearchText] = useState("");
  const integrationUrl = "https://api.thecodemesh.online/api/v1/trigger/proxy/61e1c443243a1100127ea130/v1/search?type=album,track,artist&q=main hoon &redirect_url=" + window.location;

  useEffect(() => {
    throttledSearch(searchText, searchSpotify);
  }, [searchText]);

  const searchSpotify = (searchText) => {
    let spotifySearchUrl = updateQueryStringParameter(integrationUrl, "q", searchText);
    const theCodeMeshTokens = getToken();
    axios
      .get(`${spotifySearchUrl}`, {
        headers: theCodeMeshTokens,
      })
      .then((response) => {
        setUserLoggedIn(1);
        setData(response.data);
      })
      .catch((error) => {
        const loginUrl = errorHandler(error);
        if (loginUrl !== -1) {
          setUserLoggedIn(0);
          setLoginUrl(loginUrl);
        }
      });
  };

  return (
    <React.Fragment>
      {userLoggedIn === 0 && (
        <div className="text-center p-4">
          Please login with your spotify account, <a className="text-blue-500 hover:text-blue-700 cursor-pointer" href={loginUrl}> Click here </a>
        </div>
      )}
      {userLoggedIn === 1 && (
        <div>
          <div className="text-center p-4 w-full bg-gray-800 fixed top-0">
            <input className="border-2 border-blue-500 w-60 h-10 items-center p-4 rounded-full" type="text" name="search" placeholder="Search for a song or artist" onChange={(event) => setSearchText(event.target.value)} />
          </div>
          <div className="mt-20 flex flex-row flex-wrap text-xs">
            {data &&
              data.tracks?.items &&
              data.tracks.items.map((track) => (
                <div key={track.id} className="m-4 p-3 h-20 cursor-pointer flex flex-row items-center shadow-lg">
                  <div className="flex flex-col items-center">
                    <div className="text-sm">
                      <a className="text-blue-500 font-semibold hover:text-blue-700" href={track.external_urls.spotify}>
                        {track.name}
                      </a>
                    </div>
                    <div>
                      by{" "}
                      <a className="underline text-blue-500 hover:text-blue-700" href={track.artists[0].external_urls?.spotify}>
                        {track.artists[0].name}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            {data &&
              data.albums?.items &&
              data.albums.items.map((album) => (
                <div key={album.id} className="m-4 p-2 h-20 cursor-pointer flex flex-row items-center shadow-lg">
                  <img className="w-20 h-20" src={album?.images[0].url} />

                  <div className="flex p-3 flex-col items-center">
                    <div className="text-sm">
                      <a className="text-blue-500 font-semibold hover:text-blue-700" href={album.external_urls.spotify}>
                        {album.name}
                      </a>
                    </div>
                    <div>
                      by{" "}
                      <a className="underline text-blue-500 hover:text-blue-700" href={album.artists[0].external_urls?.spotify}>
                        by {album.artists[0].name}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            {data &&
              data.artists?.items &&
              data.artists.items.map((artist, index) => (
                <div key={artist.id} className="m-4 p-2  h-20 cursor-pointer flex flex-row items-center shadow-lg">
                  <img className="w-20 h-20" src={artist?.images?.length ? artist?.images[0].url : null} />
                  <div className="p-3">
                    by{" "}
                    <a className="text-sm font-semibold text-blue-500 hover:text-blue-700" href={artist.external_urls?.spotify}>
                      {artist.name}
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
export default Home;
