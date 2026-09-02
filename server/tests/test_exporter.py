import unittest

from server.pdf.exporter import browser_launch_candidates, build_print_url


class ExporterTests(unittest.TestCase):
    def test_build_print_url_encodes_chinese_json(self):
        url = build_print_url(
            "http://localhost:3000",
            {"version": 1, "metadata": {"title": "中文简历"}},
        )

        self.assertTrue(url.startswith("http://localhost:3000/resume/print?data="))
        self.assertNotIn("中文简历", url)

    def test_browser_candidates_fall_back_to_installed_channels(self):
        candidates = browser_launch_candidates(None)

        self.assertEqual(candidates[0], {})
        self.assertIn({"channel": "chrome"}, candidates)


if __name__ == "__main__":
    unittest.main()
