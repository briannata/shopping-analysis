import pandas as pd

def process_csv(input_csv):
    # Read the CSV file
    data = pd.read_csv(input_csv)

    # List of demographic columns
    q_demos_columns = ["Q-demos-age", "Q-demos-gender", "Q-demos-income", "Q-demos-race", "Q-demos-education"]

    for q_demos_col in q_demos_columns:
        # Group by the column and Category, and count the rows
        grouped = data.groupby([q_demos_col, "Category"]).size().reset_index(name="Value")

        # Get the top 5 categories for each group
        top_categories = (
            grouped.groupby(q_demos_col)
            .apply(lambda x: x.nlargest(5, "Value"))
            .reset_index(drop=True)
        )

        # Rename the column to "Group"
        top_categories = top_categories.rename(columns={q_demos_col: "Group"})

        # Replace long graduate or professional degree label
        if q_demos_col == "Q-demos-education":
            top_categories['Group'] = top_categories['Group'].replace('Graduate or professional degree (MA, MS, MBA, PhD, JD, MD, DDS, etc)', 'Graduate/professional')
            top_categories['Group'] = top_categories['Group'].replace("Bachelor's degree", "Bachelor's")
            top_categories['Group'] = top_categories['Group'].replace('High school diploma or GED', 'High school/GED')
            top_categories['Group'] = top_categories['Group'].replace('Some high school or less', '< High school')

        # Filter race demographic categories (get rid of categories that are combinations of these and have much less data)
        if q_demos_col == "Q-demos-race":
            top_categories = top_categories[top_categories['Group'].isin(['Black or African American', 'White or Caucasian', 'Other' , 'Asian', 'American Indian/Native American or Alaska Native'])]
            top_categories['Group'] = top_categories['Group'].replace('Black or African American', 'African American')
            top_categories['Group'] = top_categories['Group'].replace('White or Caucasian', 'Caucasian')
            top_categories['Group'] = top_categories['Group'].replace('American Indian/Native American or Alaska Native', 'American Indian/Native American/Alaska Native')

        # Save to a new CSV file
        demo = q_demos_col.replace("Q-demos-", "")
        output_csv = f"../d3data/{demo}_top_categories.csv"
        top_categories.to_csv(output_csv, index=False)
        print(f"Saved: {output_csv}")

process_csv("../data/joined-amazon-purchases.csv")