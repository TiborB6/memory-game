import React, { useEffect, useState, useRef } from "react";
import Images from "./IMG_Module";
import Card from "../card/Card";
import './game.scss'

export default function Game () {
  // Handles Scores
  const [score, setScore] = useState({
    score: 0,
    highscore: 0,
  })

  // Handles high score logic
  useEffect(() => {
    if (score.score > score.highscore) {
      setScore((prevScore) => ({
        ...prevScore,
        highscore: prevScore.score   
      }))
    }
  }, [score])

  // Handles Game Logic
  const [gameState, setGameState] = useState({
    round: 0,
    cards: 0,
  })

  // Sets cards everytime rounds is updated
  useEffect(() => {
    setGameState((prevGameState) => ({
      ...prevGameState,
      cards: 4 + prevGameState.round,
    }))
  }, [gameState.round])

  // Handle cards
  const [card, setCard] = useState([])

   // Create a ref to store the last shuffled cards
  const lastShuffledCardsRef = useRef([]);

  const setCards  = () => {
    const shuffledArray = [...Images];

      // Fisher-Yates shuffle algorithm
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    const slicedArr = shuffledArray.slice(0, gameState.cards) // Gets needed length

    // Adds clicked to the images
    const objArr = []
    slicedArr.forEach((item, index) => {
      objArr[index] = 
        {  
          img: item,
          clicked: false,
        }
    })

    setCard(objArr)
  }
  // Sets the cards for the round
  useEffect(() => {
    setCards()
  }, [gameState.cards])

  // Is called when a card is clicked
  const handleClick = (index) => {
    // Ends the game if wrong card is clicked 
    if (card[index].clicked) { 
      handleLose()
      return
    }

    // Increases the score
    setScore((prevScore) => ({
      ...prevScore,
      score: prevScore.score + 1,
    }));

    // Updates 
    setCard((prevCard) => {
      const updatedCard = [...prevCard]; // Create a copy of the previous card state
      updatedCard[index].clicked = true; // Update the clicked property of the specific card
      return updatedCard; // Return the updated card state
    });
  }

  // Checks is every card is clicked or not if yes it ups round if not it shuffles the cards
  useEffect(() => {
    if (card.length > 0 && card.every((obj) => obj.clicked)) {
      setGameState((prevGameState) => ({
        ...prevGameState,
        round: prevGameState.round + 1,
      }));
    } else if (lastShuffledCardsRef.current !== card) {
      const shuffledCard = [...card];
      for (let i = shuffledCard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledCard[i], shuffledCard[j]] = [shuffledCard[j], shuffledCard[i]];
      }
      lastShuffledCardsRef.current = shuffledCard
      setCard(shuffledCard);  
    }
  }, [card]);

  const handleLose = () => {
    setScore((prevScore) => ({
      ...prevScore,
      score: 0,
    }));

    setGameState((prevGameState) => ({
      ...prevGameState,
      round: 0,
    }));

    setCards()
  }

 
  return (
    <div className="game">
      <div className="scoreboard">
        <h1>Memory Game</h1>
        <div className="score-wrapper">
          <p>Score: {score.score}</p>
          <p><span>Highscore: </span>{score.highscore}</p>
        </div>
      </div>
      <div className="cards">
        {card.map((item, index) => (
          <Card onClick={() => handleClick(index)} key={index} img={item.img} clicked={item.clicked}/> 
        ))}
      </div>
    </div>
  )
}