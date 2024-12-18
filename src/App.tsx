import { FaBox, FaFistRaised, FaShieldAlt } from 'react-icons/fa';
import './App.css'
import Modal from 'react-modal';
import { useState } from 'react';
import './card.css'
import { GiSwordBrandish, GiTrapMask } from 'react-icons/gi';
import retiredPalading from './assets/cards/retiredPaladin.webp'
import blueDragon from './assets/cards/blueDragon.webp'
import cardBack from './assets/cards/cardBack.webp'
import { BiHeart } from 'react-icons/bi';
import Evy from './assets/cards/evy.webp'
import Yona from './assets/cards/yona.webp'
import Mimic from './assets/cards/mimic.webp'


Modal.setAppElement('#root');

interface ICard {
  id: number;
  elixir: number;
  image: string;
  attack: number;
  defense: number;
  description: string;
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

  const cards = [
    {
      id: 1,
      elixir: 1,
      image: retiredPalading,
      attack: 2,
      defense: 2,
      description: 'Um guerreiro cansado que já viu muitas batalhas.',
    },
    {
      id: 2,
      elixir: 7,
      image: blueDragon,
      attack: 8,
      defense: 9,
      description: 'Lendário dragão azul que cospe fogo.',
    },
    {
      id: 3,
      elixir: 4,
      image: Evy,
      attack: 3,
      defense: 5,
      description: 'Uma feiticeira misteriosa que cura um aliado em 4 de vida no início de cada turno seu.',
    },
    {
      id: 4,
      elixir: 6,
      image: Yona,
      attack: 8,
      defense: 5,
      description: 'Uma guerreira que ataca com uma espada mágica.',
    },
    {
      id: 5,
      elixir: 4,
      image: Mimic,
      attack: 2,
      defense: 2,
      description: 'Copia as últimas duas cartas que seu oponente jogou.',
    },
  ];
  return (
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
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-thumbnail"
          >
            <img src={cardBack} alt={`Fundo de carta`} />
          </div>
        ))}
      </div>
    </div>
    <div className="zone trap-zone">
      <GiTrapMask className="icon" />
      <span>Armadilhas</span>
    </div>
    <div className="zone attack-zone">
      <GiSwordBrandish className="icon" />
      <span>Ataque</span>
    </div>

    <div className="zone defense-zone">
      <FaShieldAlt className="icon" />
      <span>Defesa</span>
    </div>

  </div>
  <div className="divider">VS</div>

  <div className="player-area">
    <div className="zone defense-zone">
      <FaShieldAlt className="icon" />
      <span>Defesa</span>
    </div>

    <div className="zone attack-zone">
      <GiSwordBrandish className="icon" />
      <span>Ataque</span>
    </div>

    <div className="zone trap-zone">
      <GiTrapMask className="icon" />
      <span>Armadilhas</span>
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
        {cards.map((card) => (
          <div
            key={card.id}
            className="card-thumbnail"
            onClick={() => openModal(card)}
          >
            <img src={card.image} alt={`Carta ${card.id}`} />
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
            <div className="modal-description">{selectedCard.description}</div>
            <button onClick={closeModal}>Fechar</button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default App
