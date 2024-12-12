import pandas as pd

def process_csv(input_csv):
    # Read the CSV file
    data = pd.read_csv(input_csv)

    # List of Q-demos columns
    q_demos_columns = ["Q-demos-age", "Q-demos-gender", "Q-demos-income", "Q-demos-race", "Q-demos-education"]

    for q_demos_col in q_demos_columns:
        # Group by the Q-demos column and Category, and count the rows
        grouped = data.groupby([q_demos_col, "Category"]).size().reset_index(name="Value")

        # Get the top 5 categories for each group in the Q-demos column
        top_categories = (
            grouped.groupby(q_demos_col)
            .apply(lambda x: x.nlargest(5, "Value"))
            .reset_index(drop=True)
        )

        # Rename the Q-demos column to "Group" for clarity
        top_categories = top_categories.rename(columns={q_demos_col: "Group"})

        # Save to a new CSV file
        demo = q_demos_col.replace("Q-demos-", "")
        output_csv = f"../d3data/{demo}_top_categories.csv"
        top_categories.to_csv(output_csv, index=False)
        print(f"Saved: {output_csv}")

# Example usage
# Replace 'input.csv' with the path to your input CSV file
process_csv("../data/joined-amazon-purchases.csv")
