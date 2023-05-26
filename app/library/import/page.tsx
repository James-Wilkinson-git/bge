import axios from "axios";
const convert = require("xml-js");

type Game = {
  _attributes: {
    objecttype: string;
    objectid: string;
    subtype: string;
    collid: string;
  };
  name: { _attributes: { sortindex: string }; _text: string };
  yearpublished: { _text: string };
  image: {
    _text: string;
  };
  thumbnail: {
    _text: string;
  };
  stats: {
    _attributes: {
      minplayers: string;
      maxplayers: string;
      minplaytime: string;
      maxplaytime: string;
      playingtime: string;
      numowned: string;
    };
    rating: {
      _attributes: {};
      usersrated: {};
      average: {};
      bayesaverage: {};
      stddev: {};
      median: {};
    };
  };
  status: {
    _attributes: {
      own: string;
      prevowned: string;
      fortrade: string;
      want: string;
      wanttoplay: string;
      wanttobuy: string;
      wishlist: string;
      preordered: string;
      lastmodified: string;
    };
  };
  numplays: { _text: string };
};

const importGames = async () => {
  const result = await axios.get(
    "https://api.geekdo.com/xmlapi/collection/hermokrates?own=1"
  );
  const data = JSON.parse(
    convert.xml2json(result.data, { compact: true, spaces: 2 })
  );
  console.log(data.items.item[0]);
  return data.items.item;
};

export default async function ImportPage() {
  const games = await importGames();

  return (
    <>
      <h1>Import Library</h1>
      <div className="flex flex-wrap p-4">
        {games &&
          games.map((game: Game) => {
            return (
              <div
                className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 mb-4"
                key={game._attributes.objectid}
              >
                <p className="mb-4">{game.name._text}</p>
                <p>
                  <img src={game.thumbnail._text} alt={game.name._text} />
                </p>
              </div>
            );
          })}
      </div>
    </>
  );
}
