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
            <button v-on:click="startFlashing">Старт</button>
        </div>
        <div class="buttonsDiv">
            <div>
                <div v-on:click="panelClicked" class="panel top-left-panel" :class="{ active: isTopLeftActive}"></div>
                <div v-on:click="panelClicked" class="panel top-right-panel" :class="{ active: isTopRightActive}"></div>
            </div>
            <div>
                <div v-on:click="panelClicked" class="panel bottom-left-panel" :class="{ active: isBottomLeftActive}"></div>
                <div v-on:click="panelClicked" class="panel bottom-right-panel" :class="{ active: isBottomRightActive}"></div>
            </div>
        </div>
    </div>
</template>

<script>
    // import Vue from 'vue'
    let inputsMode = document.getElementsByName('mode')
    const flash = (panel) => {
        let delay = inputsMode[0].checked ? 1500 : inputsMode[1].checked ? 1000 : 400
        console.log(delay)
        console.log(panel)
        return new Promise((resolve) => {
            panel += ' active'
            console.log(panel)
            setTimeout(() => {
                panel = panel.replace(' active', '')
                console.log(panel)
                setTimeout(()=>{
                    resolve();
                    console.log('click!')
                }, 250)
            }, delay)
        })
    }
    const getRandomPanel = () => {
        const panels = [
            localStorage.topLeft,
            localStorage.topRight,
            localStorage.bottomLeft,
            localStorage.bottomRight
        ];
        return panels[parseInt(Math.random() * panels.length)]
    }
    let sequence = localStorage.sequence
    sequence = [
        getRandomPanel()
    ]
    let sequenceToGuess = [...sequence]

    let canClick = false

    export default {
        name: "GameField",
        data() {
            return {
                isTopLeftActive: false,
                isTopRightActive: false,
                isBottomLeftActive: false,
                isBottomRightActive: false
            }
        },
        methods: {
            panelClicked(panelClicked) {
                // console.log(canClick)
                if(!canClick) return;
                let panelClassName = panelClicked.target.className.substr(6)
                // panelClassName += ' active'
                // setTimeout(() => {
                //     panelClassName = panelClassName.replace(' active', '')
                // }, 200)
                const expectedPanel = sequenceToGuess.shift();
                // console.log(expectedPanel)
                if(expectedPanel === panelClassName) {
                    if(sequenceToGuess.length === 0) {
                        sequence.push(getRandomPanel());
                        sequenceToGuess = [...sequence];
                        setTimeout(async ()=>{
                            canClick = false
                            for (const panel of sequence) {
                                await flash(panel)
                            }
                            canClick = true
                            this.isActive = false
                        }, 1000)
                    }
                } else {
                    alert('game over');
                }
            },
            startFlashing: async () => {
                canClick = false
                // console.log(canClick)
                for (const panel of sequence) {
                    await flash(panel)
                }
                canClick = true
                // console.log(canClick)
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
        }
        // switch (panel) {
        // case 'top-left-panel':
        //     this.isTopLeftActive = true
        //     break
        // case 'top-right-panel':
        //     this.isTopRightActive = true
        //     break
        // case 'bottom-left-panel':
        //     this.isBottomLeftActive = true
        //     break
        // case 'bottom-right-panel':
        //     this.isBottomRightActive = true
        //     break
        // default:
        //     console.log('Не вышло')
        // }
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