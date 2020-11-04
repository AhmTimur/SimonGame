let topLeft = document.querySelector('.top-left-panel ');
let topRight = document.querySelector('.top-right-panel');
let bottomLeft = document.querySelector('.bottom-left-panel');
let bottomRight = document.querySelector('.bottom-right-panel');
let startButton = document.getElementById('startButton')
let inputsMode = document.getElementsByName('mode')

    const panels = [
        topLeft,
        topRight,
        bottomLeft,
        bottomRight
    ];
    const getRandomPanel = () => {
        
        return panels[parseInt(Math.random() * panels.length)];
    }

    const sequence = [getRandomPanel()];
    let sequenceToGuess = [...sequence];

    const flash = panel =>{
        let delay = inputsMode[0].checked ? 1500 : inputsMode[1].checked ? 1000 : 400
        let panelNumber = panel.className.slice(6) === 'top-left-panel' ? 1 :panel.className.slice(6) === 'top-right-panel' ? 2 :panel.className.slice(6) === 'bottom-left-panel' ? 3 : 4
        let audio = new Audio('./sounds/' + panelNumber + '.mp3');
        audio.play();
        // let music = document.getElementById("music");
        // music.innerHTML = '<embed src="./sound' + panelNumber + '.mp3" type="audio/mp3"><noembed><bgsound="music.mp3"></noembed>';
        console.log(panelNumber)
        return new Promise((resolve, reject) => {
            panel.className += ' active';
            setTimeout(() => {
                panel.className = panel.className.replace(
                        ' active',
                        ''
                    );
                    setTimeout(()=>{
                        resolve();
                    }, 250)
            }, delay);
        });
    };

    let canClick = false;

    const panelClicked = panelClicked => {
        if(!canClick) return;
        panelClicked.className += ' active'
        setTimeout(() => {
            panelClicked.className = panelClicked.className.replace(' active', '');
        }, 200)
        const expectedPanel = sequenceToGuess.shift();
        if(expectedPanel === panelClicked) {
            if(sequenceToGuess.length === 0) {
                sequence.push(getRandomPanel());
                sequenceToGuess = [...sequence];
                setTimeout(()=> {
                    startFlashing();
                }, 1000)
            }
        } else {
            //end game
            alert('game over');
        }
    }
    
    const startFlashing = async () => {
        canClick = false
        for(const panel of sequence) {
            await flash(panel)
        }
        canClick = true;
    }
    
    startButton.addEventListener("click", startFlashing)