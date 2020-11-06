<template>
    <div>
        <h1>Simon Game</h1>
        <p>Уровни сложности:</p>
        <div class="container">
            <div>
                <label for="easy">Лёгкий</label><br>
                <input type="radio" name="mode" id="easy" value="easy" checked>
            </div>
            <div>
                <label for="middle">Средний</label><br>
                <input type="radio" name="mode" id="middle" value="middle">
            </div>
            <div>
                <label for="hard">Сложный</label><br>
                <input type="radio" name="mode" id="hard" value="hard">
            </div>
            <br>
            <div>
                <button class="startButton" v-on:click="startFlashing">Старт</button>
            </div>
        </div>
        <div class="buttonsDiv">
            <div>
                <div v-on:click="panelClicked" class="panel top-left-panel"></div>
                <div v-on:click="panelClicked" class="panel top-right-panel"></div>
            </div>
            <div>
                <div v-on:click="panelClicked" class="panel bottom-left-panel"></div>
                <div v-on:click="panelClicked" class="panel bottom-right-panel"></div>
            </div>
        </div>
    </div>
</template>

<script>
    let inputsMode = document.getElementsByName('mode')
    let topLeft = document.getElementsByClassName('top-left-panel')
    let topRight = document.getElementsByClassName('top-right-panel')
    let bottomLeft = document.getElementsByClassName('bottom-left-panel')
    let bottomRight = document.getElementsByClassName('bottom-right-panel')

    const flash = (panel) => {
        let panelNumber = panel === 'top-left-panel' ? 1 : panel === 'top-right-panel' ? 2 : panel === 'bottom-left-panel' ? 3 : 4
        let audio = new Audio(require('./../../sounds/' + panelNumber + '.mp3'));
        audio.play();
        let delay = inputsMode[0].checked ? 1500 : inputsMode[1].checked ? 1000 : 400
        return new Promise((resolve) => {
            panel[0].className += ' active'
            setTimeout(() => {
                panel[0].className = panel[0].className.replace(' active', '')
                setTimeout(()=>{
                    resolve();
                }, 250)
            }, delay)
        })
    }
    const getRandomPanel = () => {
        const panels = [
            topLeft,
            topRight,
            bottomLeft,
            bottomRight
        ];
        return panels[parseInt(Math.random() * panels.length)]
    }
    let sequence = []
    sequence = [
        getRandomPanel()
    ]
    let sequenceToGuess = [...sequence]

    let canClick = false


    export default {
        name: "GameField",
        data() {
            return {
            }
        },
        methods: {
            panelClicked(panelClicked) {
                let panelNumber = panelClicked.target.className.substr(6) === 'top-left-panel' ? 1 : panelClicked.target.className.substr(6) === 'top-right-panel' ? 2 : panelClicked.target.className.substr(6) === 'bottom-left-panel' ? 3 : 4
                let audio = new Audio(require('./../../sounds/' + panelNumber + '.mp3'));
                audio.play();
                panelClicked.target.className += ' active'
                setTimeout(() => {
                    panelClicked.className = panelClicked.target.className.slice(0, -7);
                    panelClicked.target.className = panelClicked.className
                }, 200)
                if(!canClick) return;
                const expectedPanel = sequenceToGuess.shift();
                if(expectedPanel[0].className.substr(6) === panelClicked.target.className.substr(6)) {
                    if(sequenceToGuess.length === 0) {
                        sequence.push(getRandomPanel());
                        sequenceToGuess = [...sequence];
                        setTimeout(async ()=>{
                            canClick = false
                            for (const panel of sequence) {
                                await flash(panel)
                            }
                            canClick = true
                        }, 1000)
                    }
                } else {
                    alert('game over');
                }
            },
            startFlashing: async () => {
                canClick = false
                for (const panel of sequence) {
                    await flash(panel)
                }
                canClick = true
            }
        },
        mounted() {
            if (localStorage.getItem('sequence')) {
                try {
                    sequence = JSON.parse(localStorage.getItem('sequence'));
                } catch(e) {
                    localStorage.removeItem('sequence');
                }
            }
        },
        beforeUpdate() {
        }
    }
</script>

<style lang="sass">
    body
        background-color: #e9e9e9
        text-align: center
    h1
        margin: 30px
    .container div
        display: inline-block
        padding: 5px
    .buttonsDiv
        margin-top: 20px
    .panel
        width: 250px
        height: 250px
        display: inline-block
        margin: 6px
        cursor: pointer
        opacity: 0.6
        &:hover
            box-shadow: inset 0px 0px 0px 3px brown
            box-sizing: border-box
    .bottom-left-panel
        border-bottom-left-radius: 100%
        background-color: #FEEF33
    .bottom-right-panel
        border-bottom-right-radius: 100%
        background-color: #BEDE15
    .top-left-panel
        border-top-left-radius: 100%
        background-color: dodgerblue
    .top-right-panel
        border-top-right-radius: 100%
        background-color: #FF5643
    .active
        background-color: white
    .startButton
        margin-top: 20px
        padding: 20px
        width: 200px
</style>