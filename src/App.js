import React, { useState } from 'react'
import './App.css';
import parser from './parser'

function App() {
	const [state, setState] = useState({
		sentence: ""
	})

	const [lexicalResult, setLexicalResult] = useState("")
	const [parserResult, setParserResult] = useState("")

	const change = (e) => {
		setState({ ...state, [e.target.id]: e.target.value })
	}

	const lexicalAnalyzer = (kalimat) => {
		const sentence = kalimat
		let inputString = sentence.toLowerCase() + "#"

		// inisialisasi
		const listAlphabet = 'aābcčdeēfgģhiījkķlļmnņoprsštuūvzž'.split('')
		const stateList = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28', 'q29', 'q30', 'q31', 'q32', 'q33', 'q34', 'q35', 'q36', 'q37', 'q38', 'q39', 'q40', 'q41', 'q42', 'q43', 'q44', 'q45', 'q46', 'q47']


		const transitionTable = {}

		for (const state in stateList) {
			for (const alphabet in listAlphabet) {
				transitionTable[`${state} ${alphabet}`] = 'error'
			}
			transitionTable[`${state} #`] = 'error'
			transitionTable[`${state}  `] = 'error'
		}

		// spasi sebelum input string
		transitionTable['q0  '] = 'q0'

		// transisi untuk kata māte
		transitionTable['q0 m'] = 'q1'
		transitionTable['q1 ā'] = 'q2'
		transitionTable['q2 t'] = 'q6'
		transitionTable['q6 e'] = 'q46'
		transitionTable['q46  '] = 'q47'
		transitionTable['q46 #'] = 'accept'
		transitionTable['q47  '] = 'q47'
		transitionTable['q47 #'] = 'accept'

		// transisi untuk kata tante
		transitionTable['q0 t'] = 'q3'
		transitionTable['q3 a'] = 'q4'
		transitionTable['q4 n'] = 'q5'
		transitionTable['q5 t'] = 'q6'
		transitionTable['q6 e'] = 'q46'

		// transisi untuk kata tēvs
		transitionTable['q0 t'] = 'q3'
		transitionTable['q3 ē'] = 'q7'
		transitionTable['q7 v'] = 'q8'
		transitionTable['q8 s'] = 'q46'

		// transisi untuk kata kleita
		transitionTable['q0 k'] = 'q9'
		transitionTable['q9 l'] = 'q10'
		transitionTable['q10 e'] = 'q11'
		transitionTable['q11 i'] = 'q12'
		transitionTable['q12 t'] = 'q13'
		transitionTable['q13 a'] = 'q46'

		// transisi untuk kata ūdens
		transitionTable['q0 ū'] = 'q14'
		transitionTable['q14 d'] = 'q15'
		transitionTable['q15 e'] = 'q16'
		transitionTable['q16 n'] = 'q17'
		transitionTable['q17 s'] = 'q46'

		// transisi untuk kata krēsls
		transitionTable['q0 k'] = 'q9'
		transitionTable['q9 r'] = 'q18'
		transitionTable['q18 ē'] = 'q19'
		transitionTable['q19 s'] = 'q20'
		transitionTable['q20 l'] = 'q17'
		transitionTable['q17 s'] = 'q46'

		// transisi untuk kata grāmatu
		transitionTable['q0 g'] = 'q21'
		transitionTable['q21 r'] = 'q22'
		transitionTable['q22 ā'] = 'q23'
		transitionTable['q23 m'] = 'q24'
		transitionTable['q24 a'] = 'q25'
		transitionTable['q25 t'] = 'q26'
		transitionTable['q26 u'] = 'q46'

		// transisi untuk kata aizpild
		transitionTable['q0 e'] = 'q24'
		transitionTable['q24 m'] = 'q30'
		transitionTable['q30 u'] = 'q31'
		transitionTable['q31 h'] = 'q36'

		// transisi untuk kata aizpildīt
		transitionTable['q0 a'] = 'q27'
		transitionTable['q27 i'] = 'q28'
		transitionTable['q28 z'] = 'q29'
		transitionTable['q29 p'] = 'q30'
		transitionTable['q30 i'] = 'q31'
		transitionTable['q31 l'] = 'q32'
		transitionTable['q32 d'] = 'q33'
		transitionTable['q33 ī'] = 'q34'
		transitionTable['q34 t'] = 'q46'

		// transisi untuk kata dzēriens
		transitionTable['q0 d'] = 'q35'
		transitionTable['q35 z'] = 'q36'
		transitionTable['q36 ē'] = 'q37'
		transitionTable['q37 r'] = 'q38'
		transitionTable['q38 i'] = 'q39'
		transitionTable['q39 e'] = 'q40'
		transitionTable['q40 n'] = 'q41'
		transitionTable['q41 s'] = 'q46'

		// transisi untuk kata pirkt
		transitionTable['q0 p'] = 'q42'
		transitionTable['q42 i'] = 'q43'
		transitionTable['q43 r'] = 'q44'
		transitionTable['q44 k'] = 'q45'
		transitionTable['q45 t'] = 'q46'

		// transisi untuk new token
		transitionTable['q47 m'] = 'q1'
		transitionTable['q47 t'] = 'q3'
		transitionTable['q47 k'] = 'q9'
		transitionTable['q47 ū'] = 'q14'
		transitionTable['q47 g'] = 'q21'
		transitionTable['q47 a'] = 'q27'
		transitionTable['q47 d'] = 'q35'
		transitionTable['q47 p'] = 'q42'


		// lexical analyzer
		let indexChar = 0
		let state = 'q0'
		let currentToken = ''

		while (state !== 'accept' && state !== undefined) {
			let currentChar = inputString[indexChar]
			currentToken += currentChar
			state = transitionTable[`${state} ${currentChar}`]
			if (state === 'q46') {
				console.log('current token: ', currentToken, ', valid')
				currentToken = ''
			}
			// console.log(state)
			if (state === 'error' || state === undefined) {
				setParserResult(parser(kalimat))
			}

			indexChar++
		}

		if (state == 'accept') {
			setLexicalResult("WORDS ACCEPTED")
			setParserResult(parser(kalimat))
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		lexicalAnalyzer(state.sentence)
		setState({
			sentence: ""
		})
	}
	return (
		<div className="App">
			<div className="nav">
				<h1>LEXICAL ANALYZER & PARSER</h1>
				<p>GRAMMAR CHECKER FOR LATVIAN LANGUAGE</p>
			</div>
			<div className="description">
				<h2><span>FORMAT: </span><br />SUBJECT + VERB + OBJECT</h2>
				<p>accepted words are listed below</p>
				<div className="tokens">
					<div className="subject">
						<h3>SUBJECTS (NN)</h3>
						<p>māte (ibu)<br />tante (tante)<br />tēvs (ayah)</p>
					</div>
					<div className="verb">
						<h3>VERBS (VB)</h3>
						<p>aizpildīt (mengisi)<br />dzēriens (meminum)<br />pirkt (membeli)</p>
					</div>
					<div className="object">
						<h3>OBJECTS (NN)</h3>
						<p>kleita (baju)<br />ūdens (air)<br />krēsls (kursi)<br />grāmatu (buku)</p>
					</div>
				</div>
			</div>
			<div className="tobeChecked">
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						id='sentence'
						placeholder='Enter sentence here'
						autoComplete='off'
						onChange={change}
						value={state.sentence}
					/>
					<button type="submit">Check</button>
				</form>
			</div>
			<div className="result">
				<h3>Result: </h3>
				<div className="resultBox">
					<p>{lexicalResult}</p>
					<p>{parserResult}</p>
				</div>
			</div>
		</div>
	);
}

export default App;
