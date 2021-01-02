from pyPS4Controller.controller import Controller
import requests


class MyController(Controller):

    def __init__(self, **kwargs):
        Controller.__init__(self, **kwargs)

    def on_square_press(self):
        requests.get('http://0.0.0.0:5000/lights/on')

    def on_x_press(self):
        requests.get('http://0.0.0.0:5000/lights/off')

    def on_left_arrow_press(self):
        requests.get('http://0.0.0.0:5000/lights/color-next')

    def on_right_arrow_press(self):
        requests.get('http://0.0.0.0:5000/lights/color-prev')

    def on_up_arrow_press(self):
        requests.get('http://0.0.0.0:5000/lights/brightness-up')

    def on_down_arrow_press(self):
        requests.get('http://0.0.0.0:5000/lights/brightness-down')


controller = MyController(interface="/dev/input/js0", connecting_using_ds4drv=False)
# you can start listening before controller is paired, as long as you pair it within the timeout window
controller.listen(timeout=60)
