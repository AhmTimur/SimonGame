<template>
    <div>
        <h1>Simon</h1>
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
            <button v-on:click="flash">Старт</button>
        </div>
        <div class="buttonsDiv">
            <div>
                <div v-on:click="panelClicked" class="panel top-left-panel"></div>
                <div v-on:click="panelClicked" class="panel top-right-panel"></div>
            </div>
            <div>
                <audio src="./../../sounds/1.mp3"></audio><div v-on:click="panelClicked, this.previousSibling.play()" class="panel bottom-left-panel"></div>
                <div v-on:click="panelClicked" class="panel bottom-right-panel"></div>
            </div>
        </div>
    </div>
</template>

<script>

    let canClick = false
    let sequence = []


    export default {
        name: "GameField",
        data() {
            return {
            }
        },
        getRandomPanel() {
            const panels = [
                this.topLeft,
                this.topRight,
                this.bottomLeft,
                this.bottomRight
            ];
            const result = panels[parseInt(Math.random() * panels.length)]
            return console.log(result)
        },
        methods: {
            panelClicked(panelClicked) {
                if(!canClick) return;
                console.log(panelClicked)
                let sequenceToGuess = [...sequence]
                const expectedPanel = sequenceToGuess.shift();
                if(expectedPanel === panelClicked) {
                    if(sequenceToGuess.length === 0) {
                        sequence.push(this.getRandomPanel());
                        sequenceToGuess = [...sequence];
                        this.startFlashing();
                    }
                } else {
                    alert('game over');
                }
            },
            flash(panel) {
                return new Promise((resolve) => {
                    panel.className += ' active'
                    setTimeout(() => {
                        panel.className = panel.className.replace(' active', '')
                        setTimeout(()=>{
                            resolve();
                        }, 1000)
                    }, 1000)
                })
            },
            startFlashing: async (sequence) => {
                canClick = false
                for (const panel of sequence) {
                    await this.flash(panel)
                }
                canClick = true
            }

        },
        mounted() {
            this.startFlashing()
            let difficulty = document.getElementById('easy').checked === true ? 'easy' : document.getElementById('middle').checked === true ? 'middle' : 'hard'
            let delay = difficulty === 'easy' ? 1500 : difficulty === 'middle' ? 1000 : 400
            console.log(delay)
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
        margin-top: 50px
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
</style>