const 슬롯머신 = (querySelector = ".slotMachine", option) => {
    option = {
        duration: 500, 
        comma: true,
        commaAnimation: true,
        reverse: true,
        initDataSet: null,
        loopDelay: 0,
        timeGap: 300,
        stopDuration: 500,
        blur: true,
        finishAnimation: true,
        finishClass: "finishSlotMachine",
        sequenceDelay: 100,
        callback: () => {},
        ...option
    }
    const parent = document.querySelector(querySelector)
    const height = parent.getBoundingClientRect().height
    const fullNumber = option.initDataSet ? parent.dataset[option.initDataSet] : parent.textContent
    parent.innerHTML = `<article>${
        [...(option.comma ? Number(fullNumber).toLocaleString() : fullNumber)]
        .map(e => e === "," 
            ? `<p class="show">${e}</p>` 
            : `<div>${e}</div>`
        ).join(``)
    }</article>`
    document.querySelector("head").insertAdjacentHTML("beforeend", `
        <style>
            ${querySelector} article {
                display: flex;
                gap: 1px;
                overflow: hidden;
                > div {
                    display: flex;
                    flex-direction: column;
                    height: ${height}px;
                    overflow: hidden;
                    > * {
                        animation-name: slotMachine;
                        animation-fill-mode: forwards;
                    }
                    &.finishSlotMachine {animation: finishSlotMachine .3s 2;}
                }
                > p {
                    transform: translateY(-50%);
                    opacity: 0;
                    transition: .3s;
                    &.show {transform: none; opacity: 1;}
                }
            }
            @keyframes slotMachine {100% {transform: translateY(-100%);}}
            @keyframes finishSlotMachine {50% {opacity: .3;} 100% {opacity: 1;}}
        </style>`)

    const unitWrap = parent.querySelectorAll("article > div")
    const commaWrap = parent.querySelectorAll("article > p")

    const getPrev = now => now > 0 ? now - 1 : 9
    const countUp = (element, duration, delay) => {
        const numberUnit = element.textContent

        const setNumber = (number, duration = 100) => {
            if(Array.isArray(number)) number = number.join(``)
            else if(!number) element.innerHTML = `<div>0</div>`
            else
            element.innerHTML = `
                <div style="animation-duration: ${duration}ms; ${option.blur && duration === 100 && `filter: blur(1px);`}">${getPrev(number)}</div>
                <div style="animation-duration: ${duration}ms">${number}</div>
            `
        }
        const setComma = () => {
            const commaArray = Array.from(commaWrap)
            if(option.reverse) commaArray.reverse()
            const setGap = i => option.reverse ? (i + 1) * 3 : fullNumber.length % 3 + i * 3
            commaArray.forEach((e, i) => {
                e.classList.remove("show")
                setTimeout(() => e.classList.add("show"), option.duration + setGap(i) * option.timeGap)
            })
        }
        const setFinish = () => {
            if(!option.finishAnimation) return
            const gap = 100
            Array.from(unitWrap).reverse().forEach((e, i) => {
                e.classList.remove(option.finishClass)
                setTimeout(() => {
                    e.classList.add(option.finishClass)
                    option.callback()
                }, option.duration + fullNumber.length * option.timeGap + option.stopDuration + gap)
            })
        }
        let tempNumber = Math.floor(Math.random() * 10) % 10
        let startTime = 0
        let af
        const setCount = (time = 0) => {
            if(startTime === 0) startTime = time
            time -= startTime
            if(++tempNumber > 9) tempNumber = 0

            if(time > duration) {
                cancelAnimationFrame(af)
                startTime = 0
                setNumber(numberUnit, option.stopDuration)
            } else {
                if(option.sequenceDelay && delay > time) setNumber()
                else if(Math.floor(time % 100 / 10) % 10 === 0) setNumber(tempNumber % 10)
                af = requestAnimationFrame(setCount)
            }
        }
        setCount()
        setComma()
        setFinish()

        if(option.loopDelay) setInterval(() => {
            setCount()
            setComma()
            setFinish()
        }, option.duration + fullNumber.length * option.timeGap + option.loopDelay)
    }
    unitWrap.forEach((e, i) => 
        countUp(e, option.duration + (option.reverse ? fullNumber.length - i : i) * option.timeGap, (option.reverse ? fullNumber.length - i : i) * option.sequenceDelay))
}
