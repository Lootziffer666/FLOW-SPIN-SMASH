# SQLite Fehlerkorpus / Benchmark Starter

Dieses Starterprojekt liefert eine pragmatische SQLite-first v1 für drei gleichzeitige Nutzungen:

- **Normalization Core DB** über `v_normalization_candidates`
- **Benchmark DB** über `v_benchmark_error_cases`
- **Research DB** über `v_research_cases_enriched`

## Architektur in Kürze

Die Modellierung trennt bewusst:

1. **Ressourcen-Metadaten** in `sources`, `documents`, `segments`, optional `participants`
2. **Lexikon-/Variantenebene** in `lexicon_entries`, `lexicon_variants`
3. **Operative Fehlerfälle** in `error_cases`, optional `error_spans`
4. **Tiefe Annotation** in `linguistic_features`, `orthographic_feature_flags`
5. **Benchmark-/Profil-Ebene** in `benchmark_collections`, `benchmark_subsets`, `corpus_profiles`

Wichtige Annahmen für v1:

- `error_cases` ist die zentrale operative Tabelle für Normalisierung, Benchmarking und Forschung.
- Lexika bleiben eigenständig modelliert; sie werden nicht automatisch in `error_cases` gespiegelt.
- Unsicherheit, Review und Gold-Qualität werden konsistent über `review_status` und `gold_score` abgebildet.
- Tokenisierungs- und Kontextfälle werden explizit markiert (`has_context`, `requires_context`, `is_tokenization_issue`).

## Dateien

- `schema.sql` – DDL, Constraints, Indizes, Views
- `seed.sql` – kleine repräsentative Seed-Daten
- `src/database.py` – DB-Helfer + Mini-CLI
- `src/importers/*.py` – Beispiel-Importer
- `src/importers/german_annotation_importer.py` – robuster CSV-Importer für deutsch annotierte Fehlerdaten

## Deutscher CSV-Importer

Zusätzlich zu den drei Basis-Importern gibt es einen vierten Importer für deutsch annotierte CSVs im Stil von `German_Annotation_V028.csv`.

Er akzeptiert flexible Header-Aliasse, damit leicht variierende Exportformate importiert werden können. Wichtige logische Felder:

- Fehlerform: `error_form`, `fehlerform`, `fehler`
- Ziel/Korrektur: `target_form`, `korrektur`, `target`
- Kontext: `external_doc_id`/`document_id`, `segment_text`/`satz`/`context`
- Qualität: `review_status`, `gold_score`
- Optional linguistisch: `pos_tag`, `phoneme_sequence`, `grapheme_sequence`, `morpheme_segmentation`, `morpheme_tags`

Beispiel:

```bash
python -m src.database import --type german_annotations --db corpus.db --source-id 1 --file data/German_Annotation_V028.csv --language de
```

Annahmen in v1:

- Wenn nur `fehlerform` und `korrektur` vorliegen, wird trotzdem ein valider `error_case` erzeugt.
- `capitalization` wird heuristisch erkannt, wenn sich Fehler- und Zielwort nur in Groß-/Kleinschreibung unterscheiden.
- Bei vorhandenem Kontext werden automatisch `documents` und `segments` erzeugt.
- Einfache deutsche Orthographie-Flags werden heuristisch gesetzt, insbesondere Großschreibung und Konsonantenverdopplung.

- `tests/*.py` – Schema- und Importtests

## Nutzung

```bash
python -m src.database init --db corpus.db
python -m src.database seed --db corpus.db
pytest
```

Beispielimporte:

```bash
python -m src.database import --db corpus.db --type lexicon --file data/example_lexicon.csv --source-id 1 --language en
python -m src.database import --db corpus.db --type error_pairs --file data/example_pairs.csv --source-id 2 --language de
python -m src.database import --db corpus.db --type context --file data/example_context.csv --source-id 3 --language en
```

## Erwartete CSV-Formate

### Lexikon
`canonical_form,variant_form,variant_type,observed_count,review_status,gold_score,requires_context`

### Fehlerpaare
`error_form,target_form,error_type,variant_type,observed_count,review_status,gold_score,informant_group`

### Kontextsegmente
`external_doc_id,segment_text,normalized_text,error_form,target_form,span_start,span_end,speaker,review_status,gold_score`

## Hinweise

- SQLite Foreign Keys werden bei jeder Verbindung aktiviert.
- Keine externen Netzwerkanfragen.
- Das Design ist normalisiert genug für Konsistenz, aber bewusst nicht überzerlegt.
- Für spätere Exporte können weitere Views oder materialisierte Exporttabellen ergänzt werden.