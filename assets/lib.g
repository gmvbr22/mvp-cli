import 'package:flutter/widgets.dart';

abstract class Presenter<V> {
  V? view;
}

abstract class XStateful<P extends Presenter> extends StatefulWidget {
  final P presenter;
  const XStateful(this.presenter, {Key? key}) : super(key: key);
}

abstract class XState<V, S extends XStateful<Presenter<V>>> extends State<S> {
  V bind();

  @override
  void initState() {
    widget.presenter.view = bind();
    super.initState();
  }

  @override
  void didUpdateWidget(covariant S oldWidget) {
    oldWidget.presenter.view = null;
    widget.presenter.view = bind();
    super.didUpdateWidget(oldWidget);
  }

  @override
  void dispose() {
    widget.presenter.view = null;
    super.dispose();
  }
}
