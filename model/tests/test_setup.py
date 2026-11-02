import src


def test_src_package_is_importable() -> None:
    assert src.__file__ is not None
