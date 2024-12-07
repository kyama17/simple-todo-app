import time

import streamlit as st
import streamlit.components.v1 as components

st.title("🎈 My new app")
st.write(
    "Let's start building! For help and inspiration, head over to [docs.streamlit.io](https://docs.streamlit.io/)."
)


# 処理内容のサンプル
st.write("処理完了時に音を鳴らすデモ")

if st.button("処理開始"):
    with st.spinner("処理中..."):
        time.sleep(3)  # 3秒待つ

    st.success("処理が完了しました！")

    # 音を鳴らすHTMLコード
    components.html(
        """
        <audio id="success-audio" src="https://www.soundjay.com/button/beep-07.wav" autoplay></audio>
        """,
        height=0,
    )
