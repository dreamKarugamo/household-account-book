import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

type Category = "食費" | "交通費" | "娯楽費" | "交際費" | "雑費";

interface Expenditure {
    id: number;
    date: string;
    amount: number;
    category: Category;
    memo: string;
}

// 格式高い上品なカラーパレット
const COLORS = {
    食費: "#A8E6CF", // ミントグリーン
    交通費: "#ADE4FF", // セレニティブルー
    娯楽費: "#FFD3B6", // アプリコット
    交際費: "#FFAAA6", // シェルピンク
    雑費: "#DED2F9", // ラベンダー
};

function App() {
    const [userInput, setUserInput] = useState("");
    const [amount, setAmount] = useState("");
    const [userSelected, setUserSelected] = useState<Category>("食費");
    const [memo, setMemo] = useState("");

    const [history, setHistory] = useState<Expenditure[]>(() => {
        const saved = localStorage.getItem("history");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("history", JSON.stringify(history));
    }, [history]);

    const totalAmount = history.reduce((sum, item) => sum + item.amount, 0);

    const chartData = Object.keys(COLORS)
        .map((cat) => {
            const categoryName = cat as Category;
            const total = history
                .filter((item) => item.category === categoryName)
                .reduce((sum, item) => sum + item.amount, 0);
            return { name: categoryName, value: total };
        })
        .filter((data) => data.value > 0);

    const addToList = () => {
        if (!userInput || !amount) {
            alert("日付と金額を入力してください");
            return;
        }

        const newItem: Expenditure = {
            id: Date.now(),
            date: userInput,
            amount: Number(amount),
            category: userSelected,
            memo: memo,
        };

        setHistory([...history, newItem]);
        setAmount("");
        setMemo("");
    };

    const deleteBtn = (id: number) => {
        setHistory(history.filter((item) => item.id !== id));
    };

    // インラインスタイルの定義
    const styles = {
        container: {
            backgroundColor: "#F9F8F3", // 温かみのあるアイボリー
            minHeight: "100vh",
            fontFamily:
                '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif',
            color: "#4A4A4A",
            padding: "40px 20px",
        },
        inner: {
            maxWidth: "900px",
            margin: "0 auto",
        },
        header: {
            textAlign: "center" as const,
            marginBottom: "40px",
        },
        title: {
            fontSize: "2.5rem",
            fontWeight: "300",
            letterSpacing: "3px",
            color: "#556B2F", // セージグリーン（格式高い植物のイメージ）
            margin: "0 0 10px 0",
        },
        subtitle: {
            fontSize: "0.9rem",
            color: "#8C8A80",
            letterSpacing: "1px",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: window.innerWidth > 768 ? "1fr 1fr" : "1fr",
            gap: "30px",
            marginBottom: "40px",
            alignItems: "start",
        },
        card: {
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "30px",
            boxShadow: "0 8px 24px rgba(140, 138, 128, 0.06)",
            border: "1px solid #EFECE3",
        },
        cardTitle: {
            fontSize: "1.25rem",
            fontWeight: "400",
            color: "#556B2F",
            margin: "0 0 20px 0",
            borderBottom: "2px solid #F1EDE4",
            paddingBottom: "10px",
        },
        formGroup: {
            marginBottom: "18px",
        },
        label: {
            display: "block",
            fontSize: "0.85rem",
            color: "#7A7871",
            marginBottom: "6px",
            fontWeight: "500",
        },
        input: {
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #DDD9CE",
            backgroundColor: "#FAFAFA",
            fontSize: "1rem",
            color: "#4A4A4A",
            boxSizing: "border-box" as const,
            outline: "none",
            transition: "all 0.3s",
        },
        button: {
            width: "100%",
            padding: "14px",
            backgroundColor: "#6B8E23", // オリーブグリーン
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.1rem",
            fontWeight: "500",
            cursor: "pointer",
            letterSpacing: "2px",
            boxShadow: "0 4px 12px rgba(107, 142, 35, 0.2)",
            transition: "background-color 0.2s",
        },
        totalSection: {
            textAlign: "center" as const,
            padding: "20px",
            backgroundColor: "#F4F7F4",
            borderRadius: "12px",
            marginBottom: "25px",
            border: "1px solid #E2ECE2",
        },
        totalAmount: {
            fontSize: "2.2rem",
            color: "#3B5323",
            fontWeight: "bold",
            margin: "5px 0 0 0",
        },
        historyList: {
            listStyle: "none",
            padding: 0,
            margin: 0,
        },
        historyItem: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: "1px solid #F1EDE4",
        },
        itemMain: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
        },
        badge: (category: Category) => ({
            backgroundColor: COLORS[category],
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "bold" as const,
            color: "#4A4A4A",
        }),
        itemDate: {
            fontSize: "0.85rem",
            color: "#9A9890",
        },
        itemMemo: {
            fontSize: "0.9rem",
            color: "#6A6861",
            marginTop: "2px",
        },
        itemAmount: {
            fontSize: "1.1rem",
            fontWeight: "600" as const,
            color: "#4A4A4A",
            marginRight: "15px",
        },
        deleteButton: {
            backgroundColor: "transparent",
            border: "1px solid #E0DCD0",
            color: "#A09C90",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.8rem",
            transition: "all 0.2s",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.inner}>
                {/* ヘッダー */}
                <header style={styles.header}>
                    <h1 style={styles.title}>暮らしの家計簿</h1>
                    <div style={styles.subtitle}>
                        日々の丁寧な記録が、豊かな明日をつくります
                    </div>
                </header>

                <div style={styles.grid}>
                    {/* 左側：入力カード */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>支出の記録</h2>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>日付</label>
                            <input
                                type="date"
                                style={styles.input}
                                onChange={(e) => setUserInput(e.target.value)}
                                value={userInput}
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>カテゴリ</label>
                            <select
                                style={styles.input}
                                value={userSelected}
                                onChange={(e) =>
                                    setUserSelected(e.target.value as Category)
                                }
                            >
                                <option value="食費">食費</option>
                                <option value="交通費">交通費</option>
                                <option value="娯楽費">娯楽費</option>
                                <option value="交際費">交際費</option>
                                <option value="雑費">雑費</option>
                            </select>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>金額（円）</label>
                            <input
                                type="number"
                                style={styles.input}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>メモ</label>
                            <input
                                type="text"
                                style={styles.input}
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                                placeholder="（例）有機野菜の購入"
                            />
                        </div>

                        <button style={styles.button} onClick={addToList}>
                            帳簿に書き込む
                        </button>
                    </div>

                    {/* 右側：状況分析（グラフ）カード */}
                    <div style={styles.card}>
                        <h2 style={styles.cardTitle}>今月の暮らし分析</h2>

                        <div style={styles.totalSection}>
                            <div
                                style={{
                                    fontSize: "0.85rem",
                                    color: "#6B8E23",
                                    letterSpacing: "1px",
                                }}
                            >
                                総支出額
                            </div>
                            <div style={styles.totalAmount}>
                                {totalAmount.toLocaleString()}{" "}
                                <span style={{ fontSize: "1.2rem" }}>円</span>
                            </div>
                        </div>

                        {history.length > 0 ? (
                            <div style={{ width: "100%", height: 220 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={65}
                                            innerRadius={35} // ドーナツグラフにしてさらに洗練された印象に
                                            paddingAngle={3}
                                        >
                                            {chartData.map((entry) => (
                                                <Cell
                                                    key={`cell-${entry.name}`}
                                                    fill={
                                                        COLORS[
                                                            entry.name as Category
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) =>
                                                `${Number(value).toLocaleString()} 円`
                                            }
                                        />
                                        <Legend
                                            iconSize={10}
                                            layout="horizontal"
                                            verticalAlign="bottom"
                                            align="center"
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#A09C90",
                                    padding: "40px 0",
                                    fontSize: "0.9rem",
                                }}
                            >
                                データを入力すると割合がここに表示されます
                            </div>
                        )}
                    </div>
                </div>

                {/* 下側：履歴カード */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>これまでの支出履歴</h2>

                    {history.length === 0 ? (
                        <p
                            style={{
                                textAlign: "center",
                                color: "#A09C90",
                                padding: "20px 0",
                            }}
                        >
                            まだ記録はありません。最初の1歩を記録してみましょう。
                        </p>
                    ) : (
                        <ul style={styles.historyList}>
                            {history.map((item) => (
                                <li key={item.id} style={styles.historyItem}>
                                    <div style={styles.itemMain}>
                                        <span
                                            style={styles.badge(item.category)}
                                        >
                                            {item.category}
                                        </span>
                                        <div>
                                            <div style={styles.itemDate}>
                                                {item.date}
                                            </div>
                                            {item.memo && (
                                                <div style={styles.itemMemo}>
                                                    {item.memo}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <span style={styles.itemAmount}>
                                            {item.amount.toLocaleString()} 円
                                        </span>
                                        <button
                                            style={styles.deleteButton}
                                            onClick={() => deleteBtn(item.id)}
                                        >
                                            削除
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
