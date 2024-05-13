import React, { useRef } from "react";
import Modal from "react-modal";
import { PokemonDetailType } from "../types";
import ReactLoading from "react-loading";
import "./PokemonDetail.css";
import { downloadPokemonDetails, getPokemonDetail } from "../utils";

const statColorMap: { [key: string]: string } = {
  hp: "#800000",
  attack: "#000080",
  defense: "#004000",
  "special-attack": "#400040",
  "special-defense": "#804000",
  speed: "#808000",
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    background: "#101010",
    color: "white",
    borderRadius: "10px",
  },
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.75  )" },
};

const PokemonDetail = ({
  url,
  onClose,
}: {
  url: string;
  onClose: () => void;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pokemonDetail, setPokemonDetail] = React.useState<PokemonDetailType>({
    name: "",
    sprites: {
      front_default: "",
    },
    stats: [],
  });

  React.useEffect(() => {
    if (url) {
      getPokemonDetail({
        url,
        setPokemonDetail,
        setIsLoading,
      });
    }
  }, [url]);

  return (
    <Modal
      isOpen={Boolean(url)}
      contentLabel={pokemonDetail?.name || ""}
      onRequestClose={() => {
        onClose();
      }}
      style={customStyles}
      ariaHideApp={false}
    >
      <div className="pokemon-detail">
        {isLoading ? (
          <ReactLoading type="spin" color="white" aria-label="loading" />
        ) : (
          <>
            <div className="download-area" ref={ref}>
              <div className="pokemon-profile">
                <img
                  src={pokemonDetail.sprites.front_default}
                  alt={pokemonDetail.name}
                />
                <h2 data-testid="pokemon-name">{pokemonDetail.name}</h2>
              </div>
              <div className="pokemon-stats">
                {pokemonDetail.stats.map((stat) => (
                  <div key={stat.stat.name} className="pokemon-stat">
                    <div className="stat-name">{stat.stat.name}</div>
                    <div className="stat-bar">
                      <div
                        style={{
                          width: `${(stat.base_stat * 2) / 3}%`,
                          backgroundColor: statColorMap[stat.stat.name],
                          borderRadius: "5px",
                        }}
                      >
                        {stat.base_stat}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button
              className="download-button"
              onClick={() =>
                downloadPokemonDetails({
                  ref,
                  name: pokemonDetail.name,
                  pokemonImage: pokemonDetail.sprites.front_default,
                })
              }
            >
              Download
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default PokemonDetail;
