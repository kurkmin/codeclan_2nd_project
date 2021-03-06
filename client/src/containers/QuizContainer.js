import React, { useState, useEffect } from 'react';
import Feedback from '../components/quiz/Feedback';
import Questions from '../components/quiz/Questions';
import PlanetSelector from '../components/solar/PlanetSelector';

function QuizContainer({ planets, planet, getSelectedPlanet, formData }) {

  const [quizzes, setQuizzes] = useState([]);
  const [constructedQuizzes, setConstructedQuizzes] = useState([]);
  const [answerBoolean, setAnswerBoolean] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [planetMoons, setPlanetMoons] = useState(null);
  
  

  const handleSubmit = (formData) => {
    let index = formData.questionId
   
    if (correctAnswers[index] == formData.inputAnswer) {
      setAnswerBoolean(true)
    }

    else {
      setAnswerBoolean(false)
    }
  }

  const checkMoons = (planet) => {
    if (planet.moons) {
      const numberOfMoons = planet.moons.length
      console.log("Moons array" + planet.moons)
      setPlanetMoons(numberOfMoons)
      console.log("Planet Moons" + planetMoons)
    }

    else {
      setPlanetMoons(0)
    }
  }

  const planetName = planet.englishName
  const quizList = quizzes.map((quiz) => {
    return (
      quiz.question + planetName + "?"
    )
  })


  function getQuizzes() {
    fetch('http://localhost:9000/api/quizzes')
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .then(setConstructedQuizzes(quizList))
  }

  useEffect(() => {
    getQuizzes();
  }, []);

  useEffect(() => {
    setConstructedQuizzes(quizList)
  }, [planet]);

  useEffect(() => {
    const answerPaths = [planet.gravity, planet.name, planetMoons, planet.meanRadius, planet.density]
    setCorrectAnswers(answerPaths)
  }, [planet, planetMoons])

  useEffect(() => {
    checkMoons(planet)
  }, [planet])

  return (

    <main className='main-grid quiz-grid'>
      <PlanetSelector planets={planets} getSelectedPlanet={getSelectedPlanet} />
      <Questions handleSubmit={handleSubmit} answerBoolean={answerBoolean} planets={planets} planet={planet}
        quizzes={constructedQuizzes} correctAnswers={correctAnswers}/>
      <Feedback quizzes={quizzes} answerBoolean={answerBoolean} />
    </main>
  )

}

export default QuizContainer;