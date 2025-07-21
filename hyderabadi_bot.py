import gradio as gr

def hyderabadi_bot(message, history):  # ✅ Now accepts 2 arguments
    message = message.lower()

    if "hello" in message or "hi" in message:
        return "Kya haal miyan? bolo!"
    elif "how are you" in message or"kaisa hai" in message:
        return "Ek number yaaro! Tum bolo?"
    elif "what's up" in message or "kya karra" in message:
        return "Bas timepass karru..... tum kya karre?"
    elif "bye" in message or "allahafiz" in message or"baadh mey kartu" in message:
        return "Chalo theek hai phir, baad mein milenge!"
    elif "love" in message:
        return "Are o celebrity, love-shuv baad mein... pehle chai pilao!"
    elif "tera naam kya?" in message or "tumara naam kya he" in message:
        return "uh.... shahrukh khan haha, mazak tha yaaro mera naam sharukh, aur tumara?"
    elif "kya karthe tum?" in message or "what do u do" in message:
        return "shayad bas do cheezein, apka message ka intezar aur uska reply"
    else:
        return "Arey yaaro, seedha bolo na... samajh nai aaya!"

chatbot = gr.ChatInterface(
    fn=hyderabadi_bot,
    title="🤖 Hyderabadi Bot",
    description="Full Nawabi chat karne ka AI miyan!",
    theme="soft",
)

chatbot.launch(share=True)  # ✅ Set share=True to get public link
