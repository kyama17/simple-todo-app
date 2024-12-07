import time

import streamlit as st
import streamlit.components.v1 as components

st.title("🎈 My new app")
st.write(
    "Let's start building! For help and inspiration, head over to [docs.streamlit.io](https://docs.streamlit.io/)."
)


components.html(
    """
    <button onclick="playAudio()">処理開始</button>
    <audio id="audio" src="https://www.soundjay.com/button/beep-07.wav"></audio>
    <script>
    function playAudio() {
        document.getElementById('audio').play();
        setTimeout(() => alert("処理が完了しました！"), 3000);
    }
    </script>
    """,
    height=100,
)
