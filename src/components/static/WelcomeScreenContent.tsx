import './WelcomeScreenContent.css'

const WelcomeScreenContent = () => {
    // In advertising there's this upsidedown pyramid of the groups of people
    // who need to receive different messages. Your goal in advertising is to move people
    // from the bigger groups into the smaller groups which are closer to doing
    // what you want.
    //
    // The biggest group is where everyone is by default. They don't know about your game,
    // they aren't aware that doing subway stuff could be fun, etc. In your situation, 
    // the value you're providing is fun. So wide reaching hooks like "Test your knowledge of the NYC subway network."
    // may be enticing. This statement moves people into the second group
    //
    // The second group for you is problem aware people who now have the idea that doing an activity like
    // this would be fun. For this project, to convert people to the next group, you have to communicate that 
    // 1. you have a product, and 2. there is a clear, low cost action path to move forward. The fact that
    // you're on the internet and this text is probably on or next to a button does both 1 and 2.
    //
    // The third group is people who are product aware. Because you're not asking for money you have a very low
    // friction pipeline to getting people here. In a regular business there would be more steps to getting people
    // in front of the product, but if they clicked the previous button, they're probably on the page already.
    // To convert to the next group, all they have to do is start playing the game. So the goal now is to make it
    // as easy to start playing the game/getting the fun. Once people are on you're page, you already know that
    // they're interested and want to try it, so there's no need to try and convince them further.
    //
    // The last group is product users which just means you're done.
    //
    // The message on the page here is getting read by group 3. So in as few words as you can, get them the
    // context they need to start playing. Every extra word/button/time you add here lowers your conversion ratio.
    // Find some real people and watch them interact to see what's working here. There may be some clever shit
    // you can do to get the cost really low.
    //
    // You could definitely remove "test your knowledge". This is where having really tight terminology/narrative 
    // coherence can help you reduce cognitive load. The button says "Start Journey" right now, two words that don't
    // immediate reconsile with the notion of "test your knowledge" and "between two given stations". Wait I'm confused now,
    // do I have to just get between the two stations, or do I start at a station, or am I exploring somehow? This
    // discontinuity coupled with a lack of visual clues makes it not obvious what the goal is. And all the time
    // the user spends trying to figure out what they are supposed to be doing is not fun and lowers conversion ratio.
    //
    // I think you have to pick a narrative and really bend the whole experience into it. Maybe the situation is your character
    // is late for work or some other activity. Then you could put the character avatar next to the instruction text and get
    // that visual association of where you are on the game screen handled, and provide a narrative. Then the button could say
    // "GET IN THERE" or something funny riffing on the situation, making it clear that the goal is time reduction and getting
    // the users emotions in the right spot. Now you don't have to literally explain to the user that they need to not get lost
    // and make smart transfers. You're at a point in development where I don't think you can make the game much
    // more fun without having a decision about narrative/target emotional state.
    //
    return (
        <>
            <JigglyTitle text='NYC-Subway-Journey' />
            <p>
                Test your knowledge of the NYC subway network by finding a route between two given stations. Make smart transfers, and avoid
                getting lost!
            </p>
        </>
    )
}

const JigglyTitle = ({ text }: { text: string }) => {
    const isWheelLetter = (i: number) => {
        const prev = text[i - 1]
        const next = text[i + 1]
        const current = text[i]

        const isFirstLetter = (prev === '-' && current !== '-') || prev === undefined
        const isLastLetter = (next === '-' && current !== '-') || next === undefined

        return isFirstLetter || isLastLetter
    }

    return (
        <h1 className='jiggly-title'>
            {Array.from(text).map((char, index) => (
                <span
                    key={index}
                    className={`jiggly-letter ${isWheelLetter(index) ? 'wheel' : ''}`}
                    style={{
                        animationDelay: `${index * 0.015}s, ${index * 0.03}s`,
                    }}
                >
                    {char}
                </span>
            ))}
        </h1>
    )
}

export default WelcomeScreenContent
