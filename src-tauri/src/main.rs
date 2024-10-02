#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;
use std::error::Error;
use std::io::Cursor;

// Define the command that parses CSV
#[command]
fn parse_csv(file_content: String) -> Result<Vec<(u64, f64)>, String> {
    let mut rdr = csv::Reader::from_reader(Cursor::new(file_content));
    let mut parsed_data = Vec::new();

    for result in rdr.records() {
        match result {
            Ok(record) => {
                // Assuming the first column is timestamp (u64) and the second is a value (f64)
                if let (Ok(ts), Ok(value)) = (record[0].parse::<u64>(), record[1].parse::<f64>()) {
                    parsed_data.push((ts, value));
                } else {
                    return Err("Failed to parse CSV data.".into());
                }
            },
            Err(err) => return Err(format!("CSV parsing error: {}", err)),
        }
    }

    Ok(parsed_data)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![parse_csv])  // Register the command
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
