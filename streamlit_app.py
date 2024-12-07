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
    <audio id="audio" src="https://soundeffect-lab.info/sound/button/mp3/decision53.mp3"></audio>
    <script>
    function playAudio() {
        setTimeout(() => alert("処理が完了しました！"), 3000);
        document.getElementById('audio').play();
    }
    </script>
    """,
    height=100,
)


if st.button("処理開始"):
    with st.spinner("処理中..."):
        time.sleep(3)  # 3秒待つ

    st.success("処理が完了しました！")

    # 音を鳴らすHTMLコード
    components.html(
        """
        <audio id="success-audio" src="https://soundeffect-lab.info/sound/button/mp3/decision53.mp3" autoplay></audio>
        """,
        height=0,
    )
