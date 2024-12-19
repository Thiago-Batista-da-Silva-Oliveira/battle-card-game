import { FaBox, FaFistRaised, FaShieldAlt } from "react-icons/fa";
import "./App.css";
import Modal from "react-modal";
import { useState } from "react";
import "./card.css";
import { GiSwordBrandish, GiTrapMask } from "react-icons/gi";
import retiredPalading from "./assets/cards/retiredPaladin.webp";
import blueDragon from "./assets/cards/blueDragon.webp";
import cardBack from "./assets/cards/cardBack.webp";
import { BiHeart } from "react-icons/bi";
import Evy from "./assets/cards/evy.webp";
import Yona from "./assets/cards/yona.webp";
import Mimic from "./assets/cards/mimic.webp";
import ShieldMan from "./assets/cards/shieldMan.webp";
import Hydra from "./assets/cards/hydra.webp";
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";

Modal.setAppElement("#root");

interface ICard {
  id: number;
  elixir: number;
  image: string;
  attack: number;
  defense: number;
  description: string;
  type: "monster" | "trap" | "spell";
}

interface IZone {
  id: string;
  children: React.ReactNode;
}

interface ICardProps {
  card: ICard;
  openModal: (card: ICard) => void;
}

function Card({ card, openModal }: ICardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragTimeout, setDragTimeout] = useState<number | undefined>();
  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    const timeout = setTimeout(() => {
      setIsDragging(true);
    }, 200);
    setDragTimeout(timeout);
  };

  const handleMouseUp = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (!isDragging) {
      openModal(card);
    }
    setIsDragging(false);
    clearTimeout(dragTimeout);
  };
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: card.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card-thumbnail"
      {...listeners}
      {...attributes}
      onMouseDown={(e) => handleMouseDown(e)}
      onMouseUp={(e) => handleMouseUp(e)}
      onMouseLeave={() => clearTimeout(dragTimeout)}
    >
      <img src={card.image} alt={`Carta ${card.id}`} />
    </div>
  );
}

function Zone({ id, children }: IZone) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const style = {
    backgroundColor: isOver ? "lightblue" : "transparent",
    border: "none",
    width: "100%",
  };

  return (
    <div ref={setNodeRef} style={style} className={`zone ${id}-zone`}>
      {children}
    </div>
  );
}

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);

  const openModal = (card: ICard) => {
    setSelectedCard(card);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCard(null);
  };

  const cards: ICard[] = [
    {
      id: 1,
      elixir: 1,
      image: retiredPalading,
      attack: 2,
      defense: 2,
      description: "Um guerreiro cansado que já viu muitas batalhas.",
      type: "monster",
    },
    {
      id: 2,
      elixir: 7,
      image: blueDragon,
      attack: 8,
      defense: 9,
      description: "Lendário dragão azul que cospe fogo.",
      type: "monster",
    },
    {
      id: 3,
      elixir: 4,
      image: Evy,
      attack: 3,
      defense: 5,
      description:
        "Uma feiticeira misteriosa que cura um aliado em 4 de vida no início de cada turno seu.",
      type: "monster",
    },
    {
      id: 4,
      elixir: 6,
      image: Yona,
      attack: 8,
      defense: 5,
      description: "Uma guerreira que ataca com uma espada mágica.",
      type: "monster",
    },
    {
      id: 5,
      elixir: 4,
      image: Mimic,
      attack: 2,
      defense: 2,
      description: "Copia as últimas duas cartas que seu oponente jogou.",
      type: "monster",
    },
    {
      id: 6,
      elixir: 2,
      image: ShieldMan,
      attack: 1,
      defense: 6,
      description: "Um guerreiro que defende com um escudo.",
      type: "monster",
    },
    {
      id: 7,
      elixir: 9,
      image: Hydra,
      attack: 9,
      defense: 9,
      description: "Destrua um inimigo com menos ataque.",
      type: "monster",
    },
  ];
  const cartsInEnemyHand = [
    {
      id: 6,
      elixir: 2,
      image: ShieldMan,
      attack: 1,
      defense: 6,
      description: "Um guerreiro que defende com um escudo.",
      type: "monster",
    },
  ];
  const [cardsInHand, setCardsInHand] = useState<ICard[]>(cards || []);
  const [cardsInAttackZone, setCardsInAttackZone] = useState<ICard[]>([]);
  const [cardsInDefenseZone, setCardsInDefenseZone] = useState<ICard[]>([]);
  const [cardsInTrapZone, setCardsInTrapZone] = useState<ICard[]>([]);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const activeCard = cardsInHand.find((card) => card.id === active.id);
      if (activeCard) {
        if (over.id === "trap" && activeCard.type !== "trap") {
          return;
        }
        if (over.id === "attack") {
          setCardsInAttackZone([...cardsInAttackZone, activeCard]);
        } else if (over.id === "defense") {
          setCardsInDefenseZone([...cardsInDefenseZone, activeCard]);
        } else if (over.id === "trap") {
          setCardsInTrapZone([...cardsInTrapZone, activeCard]);
        }
        setCardsInHand(cardsInHand.filter((card) => card.id !== active.id));
      }
    }
  };

  return (
    <DndContext onDragEnd={(e) => handleDragEnd(e)}>
      <div className="game-board">
        <div className="opponent-area">
          <div className="zone hand-zone">
            <div className="hand-header">
              <FaFistRaised className="icon" />
              <div className="life-points">
                <BiHeart className="life-icon" />
                <span>30</span>
              </div>
              <div className="deck">
                <FaBox className="deck-icon" />
                <span>18</span>
              </div>
            </div>
            <div className="card-container">
              {cartsInEnemyHand.map((card) => (
                <div key={card.id} className="card-thumbnail">
                  <img src={cardBack} alt={`Fundo de carta`} />
                </div>
              ))}
            </div>
          </div>
          <div className="zone trap-zone">
            <GiTrapMask className="icon" />
          </div>
          <div className="zone attack-zone">
            <GiSwordBrandish className="icon" />
          </div>

          <div className="zone defense-zone">
            <FaShieldAlt className="icon" />
          </div>
        </div>
        <div className="divider">VS</div>

        <div className="player-area">
          <div className="zone defense-zone">
            <Zone id="defense">
              <FaShieldAlt className="icon" />
              <div className="card-container">
              {cardsInDefenseZone.map((card) => (
                <div
                  key={card.id}
                  onClick={() => openModal(card)}
                  className="card-thumbnail"
                >
                  <img src={card.image} alt={`Carta ${card.id}`} />
                </div>
              ))}
              </div>
            </Zone>
          </div>

          <div className="zone attack-zone">
            <Zone id="attack">
              <GiSwordBrandish className="icon" />
              <div className="card-container">
                  {cardsInAttackZone.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => openModal(card)}
                      className="card-thumbnail"
                    >
                      <img src={card.image} alt={`Carta ${card.id}`} />
                    </div>
                  ))}
              </div>
            </Zone>
          </div>

          <div className="zone trap-zone">
            <Zone id="trap">
              <GiTrapMask className="icon" />
              {
                <div className="card-container">
                  {cardsInTrapZone.map((card) => (
                    <div
                      key={card.id}
                      onClick={() => openModal(card)}
                      className="card-thumbnail"
                    >
                      <img src={card.image} alt={`Carta ${card.id}`} />
                    </div>
                  ))}
                </div>
              }
            </Zone>
          </div>

          <div className="zone hand-zone">
            <div className="hand-header">
              <FaFistRaised className="icon" />
              <div className="life-points">
                <BiHeart className="life-icon" />
                <span>30</span>
              </div>
              <div className="deck">
                <FaBox className="deck-icon" />
                <span>18</span>
              </div>
            </div>
            <div className="card-container">
              {cardsInHand.map((card) => (
                <div key={card.id} className="card-thumbnail">
                  <Card openModal={(card) => openModal(card)} card={card} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Detalhes da Carta"
          className="modal"
          overlayClassName="overlay"
        >
          {selectedCard && (
            <div className="card-details">
              <div className="modal-header">Elixir: {selectedCard.elixir}</div>
              <img src={selectedCard.image} alt="Carta" />
              <div className="modal-footer">
                <div>Ataque: {selectedCard.attack}</div>
                <div>Defesa: {selectedCard.defense}</div>
              </div>
              <div className="modal-description">
                {selectedCard.description}
              </div>
              <button onClick={closeModal}>Fechar</button>
            </div>
          )}
        </Modal>
      </div>
    </DndContext>
  );
}

export default App;
