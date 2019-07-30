//функция, перемешивающая массив
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
    }
    if(array === winningCombination) {
        return shuffle(array)
    }
    return array;
};

//комбинация на победу
const winningCombination = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

//state
class State {
    constructor(grid, status) {
        this.grid = grid;
        this.status = status;
    }
//несколько static методов, создающих state в зависимости от status
    static readyToPlay() {
        return new State([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 'ready')
    }

    static startToPlay() {
        return new State(shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]), 'play')

    }
}

// game
class Game {
    constructor(state) {
        this.state = state;
        this.render();
    }

    swapCells = (e, grid, firstIndex, secondIndex) => {
        let buffer = e.target.textContent;
        e.target.textContent = '';
        document.getElementById(secondIndex).textContent = buffer;
        let bufferGrid = grid[firstIndex];
        grid[firstIndex] = grid[secondIndex];
        grid[secondIndex] = bufferGrid;
    }

    turnValidation = (e, grid) => {
        const targetId = parseInt(e.target.id);
        if (document.getElementById(targetId-4) && document.getElementById(targetId-4).textContent === '') {
            return [e, grid, targetId, targetId-4]
        }
         
        if (document.getElementById(targetId+4) && document.getElementById(targetId+4).textContent === '') {
            return [e, grid, targetId, targetId+4]
        }
    
        if (targetId !== 3 && targetId !==7 && targetId !== 11 && targetId !== 15  && document.getElementById(targetId+1).textContent === '') {
            return [e, grid, targetId, targetId+1]
        }
    
        if (targetId !== 0 && targetId !==4 && targetId !== 8 && targetId !== 12 && document.getElementById(targetId-1).textContent === '') {
            return [e, grid, targetId, targetId-1]
        }
        return false
    }

    //проверка выигрыша
    ifWon = (grid) => {
        if(grid.toString() === winningCombination.toString()) {
            console.log('you won')
            document.querySelector('.winner').textContent = 'You won! Reset to continue'
        }
    
    }

    //обработка кликов по клетке
    handleClick = (e) => {
        const grid = this.state.grid;
        const cellsToSwap = this.turnValidation(e, grid);
        if(cellsToSwap) {
            this.swapCells(...cellsToSwap);
            this.ifWon(grid)
        }
    } 

    render() {
        const {grid, status} = this.state;
        //game rendering
        let newGrid = document.createElement('div');
        newGrid.className = 'container';
        grid.forEach( (e, i) => {
            let newButton = document.createElement('button');
            newButton.className = 'box';
            newButton.textContent = grid[i] === 0 ? '' : `${grid[i]}`;
            newButton.id = `${i}`
            if(status === 'play') {
                newButton.addEventListener('click', this.handleClick )
            }
            newGrid.appendChild(newButton);
        }) 
        document.querySelector('.container').replaceWith(newGrid);

        //button rendering
        let startButton = document.createElement('button');
        startButton.className = 'start';
        if(status === 'ready') {
            startButton.textContent = 'Старт';
        } else {
            startButton.textContent = 'Перемешать'   
        }
        
        startButton.addEventListener('click', () => {
            document.querySelector('.winner').textContent = '';
            let newState = State.startToPlay();
            this.state = {...this.state, ...newState};
            this.render();
        })

        document.querySelector('.start').replaceWith(startButton);
    }
}

let game = new Game(State.readyToPlay());
game.render()