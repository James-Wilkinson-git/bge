import axios from "axios";
const convert = require("xml-js");

const importGames = async () => {
  const result = await axios.get(
    "https://api.geekdo.com/xmlapi/collection/hermokrates?own=1"
  );
  const data = JSON.parse(
    convert.xml2json(result.data, { compact: true, spaces: 2 })
  );
  return data.items.item;
};

export default async function ImportPage() {
  const games = await importGames();

  return (
    <>
      <h1>Import Library</h1>
      {games &&
        games.map((game, i) => {
          return (
            <>
              <p>
                <img src={game.thumbnail._text} alt={game.name._text} />
              </p>
              <p>{game.name._text}</p>
            </>
          );
        })}
    </>
  );
}
