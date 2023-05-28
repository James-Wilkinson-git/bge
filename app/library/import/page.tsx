import axios from "axios";
import { PrismaClient } from "@prisma/client";
const convert = require("xml-js");

const prisma = new PrismaClient();

async function main(formattedGames: Game[]) {
  formattedGames.forEach((game: Game) => {
    prisma.game.create({
      data: { ...game },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

type BggGame = {
  _attributes: {
    objecttype: "thing";
    objectid: "250621";
    subtype: "boardgame";
    collid: "54917714";
  };
  name: { _attributes: { sortindex: "1" }; _text: "18Lilliput" };
  yearpublished: { _text: "2018" };
  image: {
    _text: "https://cf.geekdo-images.com/9uH76qr1SXvqoHcmkhb3Gw__original/img/7eDle2BpZYxzEkbDJhUr91gTA0k=/0x0/filters:format(jpeg)/pic4074251.jpg";
  };
  thumbnail: {
    _text: "https://cf.geekdo-images.com/9uH76qr1SXvqoHcmkhb3Gw__thumb/img/hH_LkG15LQc8Z20Jii418njxQsU=/fit-in/200x150/filters:strip_icc()/pic4074251.jpg";
  };
  stats: {
    _attributes: {
      minplayers: "1";
      maxplayers: "4";
      minplaytime: "60";
      maxplaytime: "90";
      playingtime: "90";
      numowned: "1790";
    };
    rating: {
      _attributes: [Object];
      usersrated: [Object];
      average: [Object];
      bayesaverage: [Object];
      stddev: [Object];
      median: [Object];
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
type Game = {
  bggId: string;
  name: string;
  yearpublished: string;
  image: string;
  thumbnail: string;
  minplayers: number;
  maxplayers: number;
  minplaytime: number;
  maxplaytime: number;
  playingtime: number;
};

const formatGames = async (games: BggGame[]) => {
  let formattedGames: Game[] = [];
  games.map((game, i) => {
    formattedGames.push({
      bggId: game._attributes.objectid,
      name: game.name._text,
      yearpublished: game.yearpublished._text,
      image: game.image._text,
      thumbnail: game.thumbnail._text,
      minplayers: parseInt(game.stats._attributes.minplayers),
      maxplayers: parseInt(game.stats._attributes.maxplayers),
      minplaytime: parseInt(game.stats._attributes.minplaytime),
      maxplaytime: parseInt(game.stats._attributes.maxplaytime),
      playingtime: parseInt(game.stats._attributes.playingtime),
    });
  });
  main(formattedGames);
};

export default async function ImportPage() {
  //Server Function, can call other server function which are outside the render function
  const importGames = async (formData: FormData) => {
    "use server";
    const bggUsername = formData.get("bggUsername");
    const result = await axios.get(
      `https://api.geekdo.com/xmlapi/collection/${bggUsername}?own=1`
    );
    const data = JSON.parse(
      convert.xml2json(result.data, { compact: true, spaces: 2 })
    );
    await formatGames(data.items.item);
  };

  return (
    <>
      <h1>Import Library</h1>
      <form className="w-full max-w-sm" action={importGames}>
        <div className="flex items-center border-b border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="bggUsername"
            placeholder="BGG Username"
            aria-label="BGG User Name"
          />
          <button
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Import
          </button>
        </div>
      </form>
    </>
  );
}
