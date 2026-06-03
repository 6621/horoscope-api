import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/match', async (req, res) => {
    const { sign, age } = req.body;
    
    const matchMap = {
        "牡羊座": "獅子座", "金牛座": "處女座", "雙子座": "天秤座",
        "巨蟹座": "雙魚座", "獅子座": "射手座", "處女座": "金牛座",
        "天秤座": "雙子座", "天蠍座": "巨蟹座", "射手座": "牡羊座",
        "摩羯座": "金牛座", "水瓶座": "天秤座", "雙魚座": "天蠍座"
    };
    const matchedSign = matchMap[sign] || "未知星座";

    const prompt = `你是一位精通現代心理學與占星術的戀愛導師。
    請針對以下條件進行客觀、溫暖且深刻的配對分析：
    - 主體星座：${sign}
    - 使用者年齡：${age}歲
    - 命定星座：${matchedSign}

    請嚴格以 JSON 格式輸出：
    {
      "matchRate": "95.4%",
      "analysis": "針對該年齡層的深度情感契合度分析，約120字。",
      "sweetTip": "具體的戀愛助攻建議，不超過40字。"
    }`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        const data = JSON.parse(response.text.trim());
        res.json(data);
    } catch (error) {
        // 備用方案
        res.json({
            matchRate: "96.2%",
            analysis: `星象顯示，${age}歲的你正在尋找一個能真正聽懂你心聲的靈魂。${sign}與${matchedSign}的磁場雖然此刻受到微小干擾，但兩人在情感深處的互補與依賴是無法被抹滅的。`,
            sweetTip: "真心比套路更具殺傷力，勇敢跨出那一步吧！"
        });
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));