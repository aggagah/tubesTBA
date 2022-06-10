import React from 'react'

function parser(kalimat) {
    const lowerSentence = kalimat.toLowerCase().split(' ')
    const tokens = Array.from(lowerSentence)
    tokens.push('EOS')

    // symbols definition
    const nonTerminals = ['S', 'NN', 'VB']
    const terminals = ['māte', 'tante', 'tēvs', 'kleita', 'ūdens', 'krēsls', 'grāmatu', 'aizpildīt', 'dzēriens', 'pirkt']

    // parse tabel definition
    const parseTable = {}

    parseTable['S māte'] = ['NN', 'VB', 'NN']
    parseTable['S tante'] = ['NN', 'VB', 'NN']
    parseTable['S tēvs'] = ['NN', 'VB', 'NN']
    parseTable['S kleita'] = ['NN', 'VB', 'NN']
    parseTable['S ūdens'] = ['NN', 'VB', 'NN']
    parseTable['S krēsls'] = ['NN', 'VB', 'NN']
    parseTable['S grāmatu'] = ['NN', 'VB', 'NN']
    parseTable['S aizpildīt'] = ['error']
    parseTable['S dzēriens'] = ['error']
    parseTable['S pirkt'] = ['error']
    parseTable['S EOS'] = ['error']


    parseTable['NN māte'] = ['māte']
    parseTable['NN tante'] = ['tante']
    parseTable['NN tēvs'] = ['tēvs']
    parseTable['NN kleita'] = ['kleita']
    parseTable['NN ūdens'] = ['ūdens']
    parseTable['NN krēsls'] = ['krēsls']
    parseTable['NN grāmatu'] = ['grāmatu']
    parseTable['NN aizpildīt'] = ['error']
    parseTable['NN dzēriens'] = ['error']
    parseTable['NN pirkt'] = ['error']
    parseTable['NN EOS'] = ['error']

    parseTable['VB māte'] = ['error']
    parseTable['VB tante'] = ['error']
    parseTable['VB tēvs'] = ['error']
    parseTable['VB kleita'] = ['error']
    parseTable['VB ūdens'] = ['error']
    parseTable['VB krēsls'] = ['error']
    parseTable['VB grāmatu'] = ['error']
    parseTable['VB aizpildīt'] = ['aizpildīt']
    parseTable['VB dzēriens'] = ['dzēriens']
    parseTable['VB pirkt'] = ['pirkt']
    parseTable['VB EOS'] = ['error']

    // stack initialization
    const stack = []
    stack.push('#')
    stack.push('S')

    // input reading initialization
    let indexToken = 0
    let symbol = tokens[indexToken]

    // parsing process
    while (stack.length > 0) {
        const top = stack[stack.length - 1]
        console.log(stack)
        console.log(symbol)
        console.log('top = ', top)
        console.log('symbol = ', symbol)

        if (terminals.includes(top)) {
            console.log('top adalah simbol terminal')
            if (top === symbol) {
                stack.pop()
                indexToken++
                symbol = tokens[indexToken]

                if (symbol === 'EOS') {
                    console.log('isi stack: ', stack)
                    stack.pop()
                }
            } else {
                console.log('error')
                break
            }
        } else if (nonTerminals.includes(top)) {
            console.log('top adalah symbol non terminal')
            if (parseTable[`${top} ${symbol}`][0] !== 'error') {
                stack.pop()
                let symbolsToBePushed = parseTable[`${top} ${symbol}`]
                for (let i = (symbolsToBePushed.length) - 1; i >= 0; i--) {
                    stack.push(symbolsToBePushed[i])
                }
            } else {
                console.log('error')
                break
            }
        } else {
            console.log('error')
            break
        }

        console.log('isi stack: ', stack)
        console.log('')
    }

    if (symbol === 'EOS' && stack.length == 0) {
        return `Input string "${kalimat}" diterima, sesuai Grammar`
    } else {
        return `Error, input string "${kalimat}" tidak diterima, tidak sesuai Grammar`
    }
}

export default parser